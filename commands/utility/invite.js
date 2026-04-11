const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Récupère le lien pour ajouter le bot sur ton serveur !'),

    async execute(input) {
        // Remplace l'URL ci-dessous par celle que tu as générée sur le portail
        const inviteUrl = "https://discord.com/oauth2/authorize?client_id=1490715155863175349";

        const embed = new EmbedBuilder()
            .setTitle("Inviter Deneb sur ton serveur")
            .setDescription("Merci de l'intérêt que tu portes à mon bot ! Clique sur le bouton ci-dessous pour m'ajouter ailleurs.")
            .setColor('#5865F2') // Couleur Blurple de Discord
            .setThumbnail(input.client.user.displayAvatarURL());

        // On ajoute un bouton stylé pour faire plus "pro"
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ajouter au serveur')
                    .setURL(inviteUrl)
                    .setStyle(ButtonStyle.Link),
            );

        if (input.isChatInputCommand && input.isChatInputCommand()) {
            await input.reply({ embeds: [embed], components: [row] });
        } else {
            await input.reply({ embeds: [embed], components: [row] });
        }
    }
};