const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exec')
        .setDescription('Exécute une commande système (Réservé au créateur).')
        .addStringOption(option => 
            option.setName('commande')
                .setDescription('La commande Linux à exécuter')
                .setRequired(true)),

    async execute(interaction) {
        // Sécurité absolue : Uniquement TOI
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Commande interdite.", flags: [MessageFlags.Ephemeral] });
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const command = interaction.options.getString('commande');

        exec(command, (error, stdout, stderr) => {
            let response = "";

            if (error) {
                response = `❌ **Erreur :**\n\`\`\`bash\n${error.message}\n\`\`\``;
            } else if (stderr) {
                response = `⚠️ **Stderr :**\n\`\`\`bash\n${stderr}\n\`\`\``;
            } else {
                response = `✅ **Stdout :**\n\`\`\`bash\n${stdout || 'Commande exécutée sans retour.'}\n\`\`\``;
            }

            // Si le texte est trop long pour Discord (> 2000 carac)
            if (response.length > 2000) {
                response = response.substring(0, 1990) + "... (tronqué)";
            }

            interaction.editReply({ content: response });
        });
    }
};