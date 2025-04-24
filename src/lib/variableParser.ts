import type { Interaction } from "discord.js";

const kvdb = Bun.redis;

export const parse = async (content: string, interaction: Interaction) => {
    let output = content
        .replace('#[sender]', interaction.user.displayName)
        .replace('#[sender:ping]', `<@${interaction.user.id}>`);

    if (content.includes('#[arg:')) {
        const args = content.matchAll(/#\[arg:(.*?)]/g);
        for (const arg of args) {
            // @ts-ignore dw its ok
            output = output.replace(arg[0], interaction.options.get(arg[1])?.value);
        }
    }

    if (content.includes('#[store:')) {
        const args = content.matchAll(/#\[store:(.*?)]/g);
        for (const arg of args) {
            const dbVar = await kvdb.hmget(interaction.guildId as string, [arg[1]]);

            output = output.replace(arg[0], dbVar[0] as string);
        }
    }

    return output;
};

export const variables: { name: string, variable: string, interaction: string; }[] = [
    {
        name: 'Sender Display Name',
        variable: '#[sender]',
        interaction: 'user.displayName',
    },
    {
        name: 'Sender Id',
        variable: '#[sender:id]',
        interaction: 'user.id'
    },
    {
        name: 'Command Argument',
        variable: '#[arg:ARG_NAME]',
        interaction: 'options.get(arg)',
    },
    {
        name: 'Store variable',
        variable: '#[store:VAR]',
        interaction: 'n/a',
    }
];