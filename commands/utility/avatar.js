const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Affiche l'avatar d'un utilisateur.")
        .addUserOption(option => 
            option.setName('membre')
                .setDescription("L'utilisateur dont tu veux voir l'avatar")
                .setRequired(false)),

    async execute(input, args) {
        const isSlash = input.isChatInputCommand !== undefined;
        let user;

        if (isSlash) {
            user = input.options.getUser('membre') || input.user;
        } else {
            // --- LOGIQUE AMÉLIORÉE POUR LE PRÉFIXE ---
            // 1. On tente de voir s'il y a une mention
            user = input.mentions.users.first();

            // 2. Si pas de mention, on regarde si un ID est fourni dans les arguments
            if (!user && args[0]) {
                try {
                    // On demande au bot d'aller chercher l'utilisateur par son ID
                    user = await input.client.users.fetch(args[0]);
                } catch (error) {
                    // Si l'ID est invalide, on ne fait rien ici (user reste undefined)
                }
            }

            // 3. Si toujours rien, on prend l'auteur du message
            if (!user) user = input.author;
        }

        const avatarUrl = user.displayAvatarURL({ size: 4096, extension: 'png' });

        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.tag}`)
            .setImage(avatarUrl)
            .setColor('#5865F2');

        const button = new ButtonBuilder()
            .setLabel('Télécharger')
            .setURL(avatarUrl)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);

        await input.reply({ embeds: [embed], components: [row] });
    },
};