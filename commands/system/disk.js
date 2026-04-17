const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disk')
        .setDescription('Affiche l\'utilisation de l\'espace disque du VPS.'),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Accès réservé.", flags: [MessageFlags.Ephemeral] });
        }

        // Commande universelle (df -h pour Linux/Mac, wmic pour Windows)
        const cmd = process.platform === 'win32' 
            ? 'wmic logicaldisk get size,freespace,caption' 
            : 'df -h --total | grep total';

        exec(cmd, (error, stdout) => {
            if (error) return interaction.reply("❌ Impossible de lire le disque.");

            const embed = new EmbedBuilder()
                .setTitle('💽 État du Stockage')
                .setColor('#e74c3c')
                .setDescription(`\`\`\`bash\n${stdout.trim()}\n\`\`\``)
                .setFooter({ text: `Plateforme : ${process.platform}` })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        });
    }
};