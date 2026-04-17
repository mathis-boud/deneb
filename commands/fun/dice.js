const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Lance un dé.')
        .addIntegerOption(option => 
            option.setName('faces')
                .setDescription('Nombre de faces (défaut : 6)')
                .setMinValue(2)
                .setMaxValue(100)),

    async execute(interaction) {
        const faces = interaction.options.getInteger('faces') || 6;
        const resultat = Math.floor(Math.random() * faces) + 1;

        const embed = new EmbedBuilder()
            .setTitle('🎲 Lancer de dé')
            .setDescription(`Tu as lancé un dé **${faces}** et obtenu : **${resultat}**`)
            .setColor('#ffffff')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3521/3521855.png');

        await interaction.reply({ embeds: [embed] });
    },
};