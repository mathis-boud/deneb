const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Révoque le bannissement d\'un utilisateur via son ID.')
        .addStringOption(option => 
            option.setName('id_utilisateur')
                .setDescription('L\'identifiant (ID) de l\'utilisateur à débannir')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('id_utilisateur');

        try {
            // On essaie de débannir l'ID fourni
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setTitle("✅ Utilisateur débanni")
                .setDescription(`L'utilisateur avec l'ID \`${userId}\` a été retiré de la liste noire.`)
                .setColor('#2ecc71')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            // Si l'ID n'est pas banni ou n'existe pas
            await interaction.reply({ 
                content: "❌ Impossible de débannir cet ID. Vérifie qu'il est correct ou qu'il est bien dans la liste des bannis.", 
                ephemeral: true 
            });
        }
    }
};