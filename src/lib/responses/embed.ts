import type { APIEmbed, Interaction } from "discord.js";

export type ResponseSchema = {
    embed: APIEmbed;
    reply: boolean;
    expire?: number;
};

export const respond = async (interaction: Interaction, response: ResponseSchema) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.sendTyping();

    const embed = response.reply ? await interaction.reply({ embeds: [response.embed] }) : await interaction.channel.send({ embeds: [response.embed] });

    if (response.expire) {
        setTimeout(() => {
            embed.delete();
        }, response.expire);
    }
};
