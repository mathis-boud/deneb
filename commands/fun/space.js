const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('space')
        .setDescription('Affiche l\'image d\'astronomie du jour de la NASA.'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Utilisation de la démo key de la NASA
            const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setDescription(data.explanation.substring(0, 300) + '...')
                .setImage(data.url)
                .setColor('#0b3d91')
                .setFooter({ text: `NASA APOD • ${data.date}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply("❌ Erreur lors de la connexion aux serveurs de la NASA.");
        }
    },
};