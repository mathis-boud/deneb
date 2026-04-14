const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('read-file')
        .setDescription('Lit le contenu d\'un fichier (Réservé au créateur).')
        .addStringOption(option => 
            option.setName('fichier')
                .setDescription('Le nom ou chemin du fichier (ex: index.js)')
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Accès refusé.", flags: [MessageFlags.Ephemeral] });
        }

        const filePath = interaction.options.getString('fichier');
        const absolutePath = path.resolve(process.cwd(), filePath);

        // Sécurité : Interdiction de sortir du dossier racine
        if (!absolutePath.startsWith(process.cwd())) {
            return interaction.reply({ content: "⚠️ Sécurité : Accès hors dossier bot interdit.", flags: [MessageFlags.Ephemeral] });
        }

        try {
            const stats = fs.statSync(absolutePath);
            
            // Sécurité : Ne pas lire si c'est un dossier ou si c'est trop gros (> 10 KB)
            if (stats.isDirectory()) return interaction.reply({ content: "❌ C'est un dossier, pas un fichier.", flags: [MessageFlags.Ephemeral] });
            if (stats.size > 10000) return interaction.reply({ content: "⚠️ Fichier trop lourd (> 10 KB). Utilise SFTP pour le lire.", flags: [MessageFlags.Ephemeral] });

            const content = fs.readFileSync(absolutePath, 'utf8');
            const extension = path.extname(filePath).slice(1) || 'txt';

            const embed = new EmbedBuilder()
                .setTitle(`📄 Contenu de ${filePath}`)
                .setDescription(`\`\`\`${extension}\n${content.substring(0, 3900)}\n\`\`\``) // Limite Discord
                .setColor('#f39c12')
                .setFooter({ text: `Taille : ${(stats.size / 1024).toFixed(2)} KB` });

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } catch (error) {
            await interaction.reply({ content: "❌ Erreur : Impossible de lire ce fichier.", flags: [MessageFlags.Ephemeral] });
        }
    }
};