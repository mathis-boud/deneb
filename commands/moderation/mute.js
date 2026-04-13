const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Met un membre en sourdine pour une durée déterminée.')
        .addUserOption(option => 
            option.setName('membre')
                .setDescription('Le membre à mettre en sourdine')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duree')
                .setDescription('Durée en minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison du mute')),
    
    // Permission requise : Modérer les membres
    async execute(interaction) {
        const user = interaction.options.getMember('membre');
        const duration = interaction.options.getInteger('duree');
        const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

        // Vérification des permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission de modérer des membres.", ephemeral: true });
            }

        if (!user.manageable) {
            return interaction.reply({ content: "❌ Je ne peux pas muter ce membre (hiérarchie des rôles).", ephemeral: true });
        }

        // Conversion des minutes en millisecondes
        const ms = duration * 60 * 1000;

        try {
            await user.timeout(ms, reason);

            const embed = new EmbedBuilder()
                .setTitle("🔇 Membre mis en sourdine")
                .setDescription(`**${user.user.tag}** a été mute.`)
                .addFields(
                    { name: 'Durée', value: `${duration} minute(s)`, inline: true },
                    { name: 'Raison', value: reason, inline: true }
                )
                .setColor('#f39c12')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur est survenue lors de l'exécution de la commande.", ephemeral: true });
        }
    }
};