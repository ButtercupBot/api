import type { Interaction } from "discord.js";

export type ResponseSchema = {
    reply: boolean;
    expire?: number;
    content: string;
};

export const respond = async (interaction: Interaction, response: ResponseSchema) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.sendTyping();

    const message = response.reply ? await interaction.reply(response.content) : await interaction.channel.send(response.content);
    if (response.expire) {
        setTimeout(() => {
            message.delete();
        }, response.expire);
    }
};