const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loto')
        .setDescription('Tente ta chance au loto !'),

    async execute(interaction) {
        const tirage = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
        const tonTirage = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
        
        const victoire = tirage.every((val, index) => val === tonTirage[index]);

        const embed = new EmbedBuilder()
            .setTitle('🎰 Tirage du Loto')
            .addFields(
                { name: '🎱 Tirage Gagnant', value: `\`${tirage.join(' - ')}\``, inline: true },
                { name: '🎟️ Ton Ticket', value: `\`${tonTirage.join(' - ')}\``, inline: true }
            )
            .setColor(victoire ? '#f1c40f' : '#34495e')
            .setDescription(victoire ? "😱 **INCROYABLE ! TU AS GAGNÉ !**" : "💸 Dommage, ce sera pour la prochaine fois.");

        await interaction.reply({ embeds: [embed] });
    },
};