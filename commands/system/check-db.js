const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('better-sqlite3')('database.sqlite');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-db')
        .setDescription('Vérifie l\'état et l\'intégrité de la base de données.'),

    async execute(interaction) {
        try {
            // 1. Vérifier si le fichier existe physiquement
            const stats = fs.statSync('reminders.sqlite');
            const fileSize = (stats.size / 1024).toFixed(2); // Taille en Ko

            // 2. Compter le nombre d'entrées (Rappels)
            const rowCount = db.prepare('SELECT COUNT(*) as total FROM reminders').get();

            // 3. Vérifier l'intégrité (PRAGMA est une commande spéciale SQLite)
            const integrity = db.prepare('PRAGMA integrity_check').get();
            const status = integrity.integrity_check === 'ok' ? '✅ Saine' : '❌ Corrompue';

            const embed = new EmbedBuilder()
                .setTitle('🗄️ Audit de la Base de Données')
                .setColor(integrity.integrity_check === 'ok' ? '#2ecc71' : '#e74c3c')
                .addFields(
                    { name: 'Fichier', value: '`reminders.sqlite`', inline: true },
                    { name: 'Taille', value: `${fileSize} Ko`, inline: true },
                    { name: 'Statut', value: status, inline: true },
                    { name: 'Données', value: `**${rowCount.total}** rappels enregistrés`, inline: false }
                )
                .setFooter({ text: 'Deneb Database Management' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ Erreur lors de l'accès à la base de données. Vérifiez si le fichier existe.", 
                ephemeral: true 
            });
        }
    }
};