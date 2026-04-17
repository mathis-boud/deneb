const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('audit')
        .setDescription('Affiche les dernières connexions SSH au serveur (Linux uniquement).'),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) return interaction.reply({ content: "❌", flags: [MessageFlags.Ephemeral] });

        if (process.platform === 'win32') {
            return interaction.reply("⚠️ Cette commande nécessite un environnement Linux (VPS).");
        }

        exec('last -n 5', (error, stdout) => {
            interaction.reply({ 
                content: `🔐 **Audit de sécurité (Derniers accès) :**\n\`\`\`bash\n${stdout}\n\`\`\``,
                flags: [MessageFlags.Ephemeral] 
            });
        });
    }
};