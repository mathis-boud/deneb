const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Affiche les 10 dernières lignes des logs du bot.'),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Accès refusé.", flags: [MessageFlags.Ephemeral] });
        }

        // On utilise 'tail' pour lire la fin du flux PM2
        // Remplace 'deneb' par le nom de ton processus PM2 si différent
        exec('pm2 logs deneb --lines 10 --nostream', (error, stdout) => {
            const logContent = stdout || "Aucun log trouvé ou PM2 non utilisé.";
            
            const embed = new EmbedBuilder()
                .setTitle('📋 Logs Console (PM2)')
                .setDescription(`\`\`\`bash\n${logContent.substring(0, 4000)}\n\`\`\``)
                .setColor('#34495e')
                .setTimestamp();

            interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        });
    }
};