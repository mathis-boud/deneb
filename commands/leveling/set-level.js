const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-level')
        .setDescription('Modifie le niveau d\'un utilisateur (Admin).')
        .addUserOption(option => option.setName('cible').setDescription('Le membre à modifier').setRequired(true))
        .addIntegerOption(option => option.setName('niveau').setDescription('Le nouveau niveau').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Sécurité : seul l'admin peut le faire

    async execute(interaction) {
        const target = interaction.options.getUser('cible');
        const level = interaction.options.getInteger('niveau');

        // On met à jour ou on insère si l'user n'existe pas encore
        db.prepare(`
            INSERT INTO levels (userId, xp, level) 
            VALUES (?, 0, ?) 
            ON CONFLICT(userId) DO UPDATE SET level = ?, xp = 0
        `).run(target.id, level, level);

        await interaction.reply({ 
            content: `✅ Le niveau de **${target.username}** a été défini sur **${level}** (XP réinitialisé).`,
            ephemeral: true 
        });
    },
};