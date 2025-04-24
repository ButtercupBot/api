import type { Interaction } from "discord.js";

export const parse = (content: string, interaction: Interaction) => {
    return new Promise<string>((resolve, reject) => {
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

        resolve(output);
    });
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
    }
];