const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pose une question à la boule magique.')
        .addStringOption(option => option.setName('question').setDescription('Ta question').setRequired(true)),

    async execute(interaction) {
        const reponses = [
            "C'est certain.", "Sans aucun doute.", "Oui, absolument.", "Tu peux compter dessus.",
            "Probablement.", "C'est bien parti.", "Oui.", "Les signes disent que oui.",
            "Réponse floue, essaie encore.", "Demande plus tard.", "Mieux vaut ne pas te le dire maintenant.",
            "Concentrate-toi et redemande.", "Ne compte pas là-dessus.", "Ma réponse est non.",
            "Mes sources disent que non.", "Perspectives peu prometteuses.", "J'en doute fort."
        ];

        const question = interaction.options.getString('question');
        const reponse = reponses[Math.floor(Math.random() * reponses.length)];

        const embed = new EmbedBuilder()
            .setTitle('🔮 La Boule Magique')
            .setColor('#2f3136')
            .addFields(
                { name: '❓ Question', value: question },
                { name: '✨ Réponse', value: reponse }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};