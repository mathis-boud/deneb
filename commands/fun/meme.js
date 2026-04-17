const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Affiche un meme aléatoire depuis Reddit.'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await fetch('https://meme-api.com/gimme/frenchmemes'); // Version française !
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setURL(data.postLink)
                .setImage(data.url)
                .setColor('#ff4500')
                .setFooter({ text: `👍 ${data.ups} | r/${data.subreddit}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply("❌ Impossible de récupérer un meme pour le moment.");
        }
    },
};