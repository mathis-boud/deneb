const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('process-list')
        .setDescription('Affiche les 10 processus les plus gourmands en RAM (Créateur uniquement).'),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ content: "❌ Accès réservé.", flags: [MessageFlags.Ephemeral] });
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        // Commande Linux : ps (process status) 
        // -eo : format personnalisé (pid, %cpu, %mem, commande)
        // --sort=-pmem : trie par utilisation mémoire décroissante
        // head -n 11 : prend l'en-tête + les 10 premiers
        const cmd = 'ps -eo pid,%cpu,%mem,comm --sort=-pmem | head -n 11';

        exec(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                return interaction.editReply("❌ Erreur lors de la récupération des processus.");
            }

            const embed = new EmbedBuilder()
                .setTitle('🖥️ Gestionnaire des Tâches VPS')
                .setDescription(`\`\`\`bash\n${stdout}\n\`\`\``)
                .setColor('#2c3e50')
                .setFooter({ text: 'Trié par utilisation mémoire (%MEM)' })
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });
        });
    }
};