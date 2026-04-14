const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('better-sqlite3')('reminders.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping-db')
        .setDescription('Mesure la latence de la base de données SQLite.'),

    async execute(interaction) {
        const start = process.hrtime.bigint();

        // On exécute une petite requête de test
        db.prepare('SELECT 1').get();

        const end = process.hrtime.bigint();
        
        // Calcul en nanosecondes converti en millisecondes
        const latency = Number(end - start) / 1_000_000;

        const embed = new EmbedBuilder()
            .setTitle('💾 Latence Base de Données')
            .setColor(latency < 1 ? '#2ecc71' : '#f1c40f')
            .addFields(
                { name: 'Moteur', value: '`SQLite3`', inline: true },
                { name: 'Temps de réponse', value: `\`${latency.toFixed(4)} ms\``, inline: true }
            )
            .setFooter({ text: 'Deneb Performance Monitor' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};