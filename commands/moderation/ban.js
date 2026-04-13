const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit définitivement un membre du serveur.')
        .addUserOption(option => 
            option.setName('membre')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison du bannissement'))
        .addIntegerOption(option =>
            option.setName('supprimer_messages')
                .setDescription('Supprimer l\'historique des messages (0-7 jours)')
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getMember('membre');
        const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
        const deleteDays = interaction.options.getInteger('supprimer_messages') || 0;

        // 1. Vérification de sécurité
        if (!user) {
            return interaction.reply({ content: "❌ Cet utilisateur n'est plus sur le serveur ou est introuvable.", ephemeral: true });
        }

        if (!user.bannable) {
            return interaction.reply({ 
                content: "❌ Impossible de bannir ce membre. Il a un rôle supérieur au mien.", 
                ephemeral: true 
            });
        }

        // 2. Exécution du bannissement
        // deleteMessageSeconds attend des secondes, d'où le calcul : jours * 24h * 3600s
        await user.ban({
            deleteMessageSeconds: deleteDays * 24 * 60 * 60, 
            reason: reason 
        });

        const embed = new EmbedBuilder()
            .setTitle("🚫 Bannissement définitif")
            .setDescription(`**${user.user.tag}** a été banni du serveur.`)
            .addFields(
                { name: 'Raison', value: reason, inline: true },
                { name: 'Messages supprimés', value: `${deleteDays} jour(s)`, inline: true }
            )
            .setColor('#c0392b')
            .setThumbnail(user.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};