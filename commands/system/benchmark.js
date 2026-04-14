const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('benchmark')
        .setDescription('Calcule la vitesse d\'exécution du processeur du VPS.'),

    async execute(interaction) {
        await interaction.deferReply();

        const start = Date.now();
        
        // Algorithme volontairement lourd : Nombres premiers
        let count = 0;
        for (let i = 2; i <= 20000; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) { isPrime = false; break; }
            }
            if (isPrime) count++;
        }

        const end = Date.now();
        const duration = end - start;

        const embed = new EmbedBuilder()
            .setTitle('🚀 Benchmark CPU')
            .setColor('#e67e22')
            .addFields(
                { name: 'Tâche', value: 'Calcul de 2 262 nombres premiers', inline: true },
                { name: 'Temps', value: `\`${duration} ms\``, inline: true },
                { name: 'Score', value: duration < 50 ? '⚡ Incroyable' : '🐢 Moyen', inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};