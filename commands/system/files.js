const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('files')
        .setDescription('Affiche les fichiers du bot sur le VPS (Réservé au créateur).')
        .addStringOption(option => 
            option.setName('chemin')
                .setDescription('Le dossier à explorer (par défaut : racine)')
                .setRequired(false)),

    async execute(interaction) {
        // 1. Sécurité maximale
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Accès refusé.", flags: [MessageFlags.Ephemeral] });
        }

        const relativePath = interaction.options.getString('chemin') || '.';
        const absolutePath = path.resolve(process.cwd(), relativePath);

        // 2. Sécurité : Empêcher de sortir du dossier du bot (Exploit de traversée de répertoire)
        if (!absolutePath.startsWith(process.cwd())) {
            return interaction.reply({ content: "⚠️ Sécurité : Tu ne peux pas sortir du dossier du bot !", flags: [MessageFlags.Ephemeral] });
        }

        try {
            const files = fs.readdirSync(absolutePath);
            
            let description = `📁 **Répertoire :** \`${relativePath}\`\n\n`;
            
            if (files.length === 0) {
                description += "_Dossier vide_";
            } else {
                description += files.map(file => {
                    const stats = fs.statSync(path.join(absolutePath, file));
                    const icon = stats.isDirectory() ? '📁' : '📄';
                    const size = stats.isDirectory() ? '' : ` (${(stats.size / 1024).toFixed(1)} KB)`;
                    return `${icon} \`${file}\`${size}`;
                }).join('\n');
            }

            const embed = new EmbedBuilder()
                .setTitle('🗄️ Gestionnaire de Fichiers')
                .setDescription(description.substring(0, 4096)) // Limite de caractères Discord
                .setColor('#34495e')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } catch (error) {
            await interaction.reply({ content: `❌ Erreur : Dossier introuvable ou inaccessible.`, flags: [MessageFlags.Ephemeral] });
        }
    }
};