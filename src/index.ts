console.time('Full Start');
import { ActivityType, Client, GatewayIntentBits, InteractionType, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { version } from '../package.json';
import { CreateFunctionMessage, GetFunctionMessage } from '$funcOnMessage';
import api from './server';
import { Runner } from '$libbutterScripts';
import Guild from '$libGuild';

const rest = new REST({ version: '9' }).setToken(Bun.env.DISCORD_TOKEN);

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

client.on('ready', async (client) => {
    console.log(`Started bot as ${client.user.tag}`);
    api.listen(Bun.env.PORT, (server) => {
        console.log(`server running: ${server.url}`);
    });
    client.user.setPresence({
        status: 'idle',
    });
    client.user.setActivity({
        name: 'Buttercup',
        state: `😺 Meow! v${version}`,
        type: ActivityType.Custom,
    });
    for (const OnMessage of await new GetFunctionMessage().all()) {
        console.time(`init message function ${OnMessage.id}`);
        new CreateFunctionMessage(
            OnMessage.guild_id,
            OnMessage.matcher,
            OnMessage.on_match
        ).discordRegister();
        console.timeEnd(`init message function ${OnMessage.id}`);
    }
    console.timeEnd('Full Start');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.sendTyping();
    const tester = new Runner(`self.butter.reply('meow!!!!!');`, interaction).run();

});

client.setMaxListeners(0);
client.login(Bun.env.DISCORD_TOKEN);

export type API = typeof api;
class InteractionHandler {
    runners: Runner[] = [];
    commands = new Map<string, SlashCommandBuilder[]>();
    create = async (guildId: string, command: SlashCommandBuilder) => {
        const commands: SlashCommandBuilder[] = [command];

        if (this.commands.has(guildId)) {
            console.log(true)
            console.log(this.commands.get(guildId))
            commands.push(this.commands.get(guildId));
            console.log(commands)
        }

        this.commands.set(guildId, commands);
    };
    register = async () => {
        if (!client.user) return new Error('Not logged in');
        for (const command of this.commands) {
            const guild = Guild.guild.byId(command[0]);
            if (!guild) throw new Error(`No Guild found: ${command[0]}`);
            await rest.put(Routes.applicationGuildCommands(client.user.id, command[0]), {
                body: [command[1]]
            });
        }
    };
}

const handler = new InteractionHandler();
await handler.create(
    '912503529338458142',
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
);
// console.log(handler.commands);
await handler.create(
    '912503529338458142',
    new SlashCommandBuilder()
        .setName('ping2')
        .setDescription('Replies with Pong2!')
);
// console.log(handler.commands);