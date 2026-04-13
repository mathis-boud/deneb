const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un membre du serveur.')
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription('Le membre à expulser')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison de l\'expulsion'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Seuls les modos peuvent voir la commande

    async execute(interaction) {
        const user = interaction.options.getMember('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

        // 1. Vérifier si l'utilisateur est expulsable (ex: on ne peut pas kick le propriétaire)
        if (!user.kickable) {
            return interaction.reply({ 
                content: "❌ Je ne peux pas expulser ce membre. Il a peut-être un rôle plus élevé que le mien ou je n'ai pas les permissions nécessaires.", 
                ephemeral: true 
            });
        }

        // 2. Procéder à l'expulsion
        await user.kick(reason);

        const embed = new EmbedBuilder()
            .setTitle("🔨 Expulsion effectuée")
            .setDescription(`**${user.user.tag}** a été expulsé du serveur.`)
            .addFields({ name: 'Raison', value: reason })
            .setColor('#e74c3c')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};