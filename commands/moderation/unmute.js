const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Retire la mise en sourdine d\'un membre.')
        .addUserOption(option => 
            option.setName('membre')
                .setDescription('Le membre à unmute')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getMember('membre');

        if (!user) {
            return interaction.reply({ content: "❌ Membre introuvable.", ephemeral: true });
        }

        if (!user.communicationDisabledUntilTimestamp) {
            return interaction.reply({ content: "❌ Ce membre n'est pas en sourdine.", ephemeral: true });
        }

        await user.timeout(null);

        const embed = new EmbedBuilder()
            .setTitle("🔊 Sourdine retirée")
            .setDescription(`**${user.user.tag}** peut de nouveau parler.`)
            .setColor('#2ecc71')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};