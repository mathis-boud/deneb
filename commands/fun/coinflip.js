const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Lance une pièce de monnaie (Pile ou Face).'),

    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Pile' : 'Face';
        const image = result === 'Pile' 
            ? 'https://i.imgur.com/vHqY7G7.png' // Trouve une image de pièce côté pile
            : 'https://i.imgur.com/S6H7C7v.png'; // Trouve une image de pièce côté face

        const embed = new EmbedBuilder()
            .setTitle('🪙 Pile ou Face ?')
            .setDescription(`La pièce tourne... et tombe sur : **${result}** !`)
            .setThumbnail(image)
            .setColor('#f1c40f');

        await interaction.reply({ embeds: [embed] });
    },
};