const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription("Affiche l'identifiant (ID) d'un membre.")
        .addUserOption(option => 
            option.setName('membre')
                .setDescription("Le membre dont tu veux l'ID")
                .setRequired(false)),

    async execute(input, args) {
        const isSlash = input.isChatInputCommand !== undefined;
        let user;

        // --- LOGIQUE DE RECHERCHE ---
        if (isSlash) {
            user = input.options.getUser('membre') || input.user;
        } else {
            // On regarde la mention ou l'ID tapé, sinon c'est l'auteur
            user = input.mentions.users.first();
            
            if (!user && args[0]) {
                try {
                    user = await input.client.users.fetch(args[0]);
                } catch (error) {
                    // Si l'ID fourni n'est pas valide
                }
            }
            
            if (!user) user = input.author;
        }

        // --- CRÉATION DE L'EMBED ---
        const embed = new EmbedBuilder()
            .setTitle(`ID de ${user.username}`)
            .setDescription(`L'identifiant de ce membre est : \`${user.id}\``)
            .setColor('#2F3136')
            .setThumbnail(user.displayAvatarURL()) // On ajoute sa petite photo à droite
            .setTimestamp();

        // --- ENVOI ---
        await input.reply({ embeds: [embed] });
    },
};