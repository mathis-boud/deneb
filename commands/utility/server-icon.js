const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-icon')
        .setDescription("Affiche l'icône du serveur actuel ou d'un autre serveur via son ID.")
        .addStringOption(option => 
            option.setName('id')
                .setDescription("L'ID du serveur (le bot doit être dessus)")
                .setRequired(false)),

    async execute(input, args) {
        const isSlash = input.isChatInputCommand !== undefined;
        let guild = input.guild; // Par défaut, le serveur actuel

        // --- LOGIQUE DE RECHERCHE DU SERVEUR ---
        const targetId = isSlash ? input.options.getString('id') : args[0];

        if (targetId) {
            // On tente de trouver le serveur dans la mémoire du bot (cache)
            const targetGuild = input.client.guilds.cache.get(targetId);
            
            if (!targetGuild) {
                const errorMsg = "❌ Je ne trouve pas ce serveur. Soit l'ID est faux, soit je ne suis pas présent sur ce serveur.";
                return isSlash 
                    ? input.reply({ content: errorMsg, ephemeral: true }) 
                    : input.reply(errorMsg);
            }
            guild = targetGuild;
        }

        // --- RÉCUPÉRATION DE L'ICÔNE ---
        const iconUrl = guild.iconURL({ size: 4096, extension: 'png' });

        if (!iconUrl) {
            const noIconMsg = `Le serveur **${guild.name}** n'a pas d'icône.`;
            return isSlash 
                ? input.reply({ content: noIconMsg, ephemeral: true }) 
                : input.reply(noIconMsg);
        }

        // --- CRÉATION DU RENDU ---
        const embed = new EmbedBuilder()
            .setTitle(`Icône de ${guild.name}`)
            .setImage(iconUrl)
            .setColor('#FEE75C') // Couleur jaune de Discord
            .setFooter({ text: `ID: ${guild.id}` });

        const button = new ButtonBuilder()
            .setLabel('Ouvrir l\'image')
            .setURL(iconUrl)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);

        await input.reply({ embeds: [embed], components: [row] });
    },
};