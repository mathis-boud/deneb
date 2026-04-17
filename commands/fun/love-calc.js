const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love-calc')
        .setDescription('Calcule le taux de compatibilité entre deux personnes.')
        .addUserOption(option => option.setName('user1').setDescription('Première personne').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('Deuxième personne').setRequired(true)),

    async execute(interaction) {
        const u1 = interaction.options.getUser('user1');
        const u2 = interaction.options.getUser('user2');

        const lovePercent = Math.floor(Math.random() * 101);
        let message = "";

        if (lovePercent > 80) message = "💞 Un match parfait !";
        else if (lovePercent > 50) message = "❤️ Il y a du potentiel.";
        else if (lovePercent > 20) message = "😐 C'est... compliqué.";
        else message = "💔 Restez amis, c'est mieux.";

        const embed = new EmbedBuilder()
            .setTitle('💘 Test de Compatibilité')
            .setDescription(`**${u1.username}** + **${u2.username}**\n\n**Score :** \`${lovePercent}%\`\n\n*${message}*`)
            .setColor(lovePercent > 50 ? '#ff6b6b' : '#54a0ff');

        await interaction.reply({ embeds: [embed] });
    },
};