import { client } from "../..";
import { type GuildMemberRoleManager, REST, Routes, SlashCommandBuilder, type RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { getXataClient, type FuncOnSlashRecord } from "../../xata";
import type { EditableData, SelectableColumn, SelectedPick } from "@xata.io/client";
import Guild from "$libGuild";
import { embedRespond, messageRespond, type EmbedResponseSchema, type MessageResponseSchema } from "$libresponses";
import { parse } from "$libvariableParser";

const rest = new REST({ version: '9' }).setToken(Bun.env.DISCORD_TOKEN);

const xata = getXataClient();
const fields: SelectableColumn<FuncOnSlashRecord>[] = ['guild_id', 'command', 'args', 'permission', 'response', 'description'];
type functionSlash = EditableData<SelectedPick<FuncOnSlashRecord, typeof fields>>;

export class CreateSlashCommand {
    private record: functionSlash;
    constructor(guild_id: string, command: string, description: string, permission: string, response: { type: 'message' | 'embed'; data: MessageResponseSchema | EmbedResponseSchema; }, args?: { name: string, type: 'string', description: string; }[]) {
        this.record = {
            id: Bun.randomUUIDv7(),
            guild_id,
            command,
            args,
            permission,
            response,
            description
        };
    };
    dbRegister = () => {
        return xata.db.FuncOnSlash.create(this.record);
    };
}

export class InteractionHandler {
    commands = new Map<string, RESTPostAPIChatInputApplicationCommandsJSONBody[]>();
    init = async () => {
        const commands = await xata.db.FuncOnSlash.getAll();
        for (const command of commands) {
            let slashCommand = new SlashCommandBuilder()
                .setName(command.command)
                .setDescription(command.description);


            if (command.args.length > 0) {
                for (const arg of command.args) {
                    switch (arg.type) {
                        case 'string': {
                            slashCommand.addStringOption(option =>
                                option
                                    .setName(arg.name as string)
                                    .setDescription(arg.description as string)
                            );
                            break;
                        }
                    }
                }
            }

            this.create(command.guild_id, slashCommand);
        }
    };
    create = async (guildId: string, command: SlashCommandBuilder) => {
        const commands = this.commands.get(guildId) || [];

        commands.push(command.toJSON());
        this.commands.set(guildId, commands);
    };
    register = async () => {
        if (!client.user) return new Error('Not logged in');
        for (const command of this.commands) {
            const guild = Guild.guild.byId(command[0]);
            if (!guild) return new Error(`No Guild found: ${command[0]}`);
            await rest.put(Routes.applicationGuildCommands(client.user.id, command[0]), {
                body: command[1]
            });
        }

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;
            if (!interaction.guildId || !interaction.commandName) return;

            const record = await xata.db.FuncOnSlash
                .select(['guild_id', 'command', 'args', 'permission', 'response'])
                .filter({
                    'guild_id': interaction.guildId,
                    'command': interaction.commandName
                }).getFirst();

            if (record === null) {
                console.warn(`Slash command ${interaction.commandName} for ${interaction.guild?.name} doesn't exist`);
                return messageRespond(interaction, {
                    content: `${interaction.commandName} isn't set up correctly as it has no handler`,
                    reply: true,
                });
            }

            if (!interaction.member?.roles) {
                return messageRespond(interaction, {
                    content: 'You don\'t have permission to use this command',
                    reply: true,
                    expire: 3000
                });
            }
            const roles = interaction.member.roles as GuildMemberRoleManager;
            const permission = !!roles.cache.filter(role => role.id === record.permission).size;
            if (!permission) {
                return messageRespond(interaction, {
                    content: 'You don\'t have permission to use this command',
                    reply: true,
                    expire: 3000
                });
            }

            switch (record.response.type as 'message' | 'embed') {
                case 'message': {
                    const { content, reply, expire } = record.response.data as MessageResponseSchema;
                    let parsedContent: string | undefined;
                    if (content.includes('#[')) {
                        parsedContent = await parse(content, interaction);
                    }
                    messageRespond(interaction, {
                        content: parsedContent || content,
                        reply,
                        expire
                    });
                    break;
                }
                case 'embed': {
                    const { embed, reply, expire } = record.response.data as EmbedResponseSchema;
                    embedRespond(interaction, {
                        reply,
                        embed,
                        expire
                    });
                    break;
                }
            }
        });
    };
    otfCreate = async (guildId: string, command: SlashCommandBuilder) => {
        if (!client.user) return new Error('Not logged in');
        const guild = Guild.guild.byId(guildId);
        if (!guild) return new Error(`No Guild found: ${guildId}`);
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
            body: [command.toJSON()]
        });
    };
}
