const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rip')
        .setDescription('Rends un dernier hommage à quelqu\'un.')
        .addUserOption(option => option.setName('cible').setDescription('La personne à enterrer').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('cible');
        // On utilise une API d'image de manipulation simple
        const ripUrl = `https://api.memegen.link/images/grave/${user.username}/Ici_repose_son_talent.png`;

        const embed = new EmbedBuilder()
            .setTitle(`🪦 Repose en paix, ${user.username}`)
            .setImage(ripUrl)
            .setColor('#34495e');

        await interaction.reply({ embeds: [embed] });
    },
};