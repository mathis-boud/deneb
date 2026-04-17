const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Donne un fait aléatoire et inutile.'),

    async execute(interaction) {
        const facts = [
            "Les cochons ne peuvent pas regarder le ciel.",
            "Le ketchup était vendu comme médicament dans les années 1830.",
            "Un escargot peut dormir pendant trois ans.",
            "Le cœur d'une crevette se trouve dans sa tête.",
            "Le briquet a été inventé avant l'allumette."
        ];

        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        const embed = new EmbedBuilder()
            .setTitle('💡 Le saviez-vous ?')
            .setDescription(randomFact)
            .setColor('#9b59b6');

        await interaction.reply({ embeds: [embed] });
    },
};