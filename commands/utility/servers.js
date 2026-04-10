const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { creatorId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Affiche la liste des serveurs où se trouve le bot (Owner uniquement).'),

    async execute(input) {
        const isSlash = input.isChatInputCommand !== undefined;
        const userId = isSlash ? input.user.id : input.author.id;

        // --- SÉCURITÉ : VÉRIFICATION DE L'OWNER ---
        if (userId !== creatorId) {
            const noAuth = "❌ Tu n'as pas la permission d'utiliser cette commande.";
            return isSlash 
                ? input.reply({ content: noAuth, ephemeral: true }) 
                : input.reply(noAuth);
        }

        // --- RÉCUPÉRATION DES SERVEURS ---
        // On récupère tous les serveurs du cache du bot
        const guilds = input.client.guilds.cache;
        
        // On prépare le texte de la liste
        // .map permet de transformer chaque serveur en une ligne de texte
        const guildList = guilds.map(guild => {
            return `• **${guild.name}** (ID: \`${guild.id}\`) | \`${guild.memberCount}\` membres`;
        }).join('\n');

        // --- CRÉATION DE L'EMBED ---
        const embed = new EmbedBuilder()
            .setTitle(`Liste des serveurs (${guilds.size})`)
            .setDescription(guildList.length > 2000 ? "La liste est trop longue pour être affichée entièrement." : guildList)
            .setColor('#2F3136') // Couleur sombre élégante
            .setTimestamp()
            .setFooter({ text: `Demandé par ${isSlash ? input.user.tag : input.author.tag}` });

        // --- ENVOI ---
        // On met ephemeral: true en Slash pour que personne ne voie ta liste de serveurs
        await input.reply({ 
            embeds: [embed], 
            ephemeral: true 
        });
    },
};