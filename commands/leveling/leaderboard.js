const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Affiche le classement des membres.')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Classement global ou local au serveur')
                .setRequired(true)
                .addChoices(
                    { name: '🌍 Global (Partout)', value: 'global' },
                    { name: '🏠 Serveur (Ici)', value: 'server' }
                )),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        await interaction.deferReply();

        // On récupère TOUS les gens qui ont de l'XP
        const allUsers = db.prepare("SELECT * FROM levels ORDER BY level DESC, xp DESC").all();

        if (allUsers.length === 0) {
            return interaction.editReply("📊 Aucun classement disponible pour le moment.");
        }

        let filteredUsers = [];
        let title = "";

        if (type === 'global') {
            title = '🌍 Classement Global (Top 10)';
            filteredUsers = allUsers.slice(0, 10);
        } else {
            title = `🏠 Classement de ${interaction.guild.name}`;
            
            // On filtre pour ne garder que les membres présents sur ce serveur
            // Note: On force le fetch si le cache est vide
            await interaction.guild.members.fetch(); 
            
            filteredUsers = allUsers
                .filter(u => interaction.guild.members.cache.has(u.userId))
                .slice(0, 10);
        }

        if (filteredUsers.length === 0) {
            return interaction.editReply("❌ Personne sur ce serveur n'est encore dans le classement !");
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(type === 'global' ? '#3498db' : '#2ecc71')
            .setTimestamp();

        let description = "";
        filteredUsers.forEach((data, index) => {
            description += `**${index + 1}.** <@${data.userId}> — Niv. \`${data.level}\` (${data.xp} XP)\n`;
        });

        embed.setDescription(description);

        await interaction.editReply({ embeds: [embed] });
    },
};