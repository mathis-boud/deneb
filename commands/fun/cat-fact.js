const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat-fact')
        .setDescription('Affiche une anecdote aléatoire sur les chats.'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            // API pour le texte
            const resFact = await fetch('https://catfact.ninja/fact');
            const dataFact = await resFact.json();

            // API pour l'image
            const resImg = await fetch('https://api.thecatapi.com/v1/images/search');
            const dataImg = await resImg.json();

            const embed = new EmbedBuilder()
                .setTitle('🐱 Le saviez-vous ?')
                .setDescription(`*${dataFact.fact}*`)
                .setImage(dataImg[0].url)
                .setColor('#f39c12')
                .setFooter({ text: 'Source: catfact.ninja' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply("❌ Miaou ! Le serveur de faits est fatigué.");
        }
    },
};