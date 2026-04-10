const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence et le temps en ligne.'),

    async execute(input) {
        const isSlash = input.isChatInputCommand !== undefined;

        // 1. On envoie un message temporaire pour mesurer le temps de réponse
        const sent = await input.reply({ content: 'Calcul du ping...', fetchReply: true, ephemeral: true });

        // 2. Calcul du Ping réel (Temps entre l'envoi et la réception de la réponse)
        const latency = sent.createdTimestamp - input.createdTimestamp;

        // 3. Calcul de l'Uptime
        let totalSeconds = (input.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptimeString = `${days}j ${hours}h ${minutes}m ${seconds}s`;

        // 4. On modifie le message temporaire avec les vraies infos
        const responseText = `Ping: **${latency}** ms\nEn ligne depuis **${uptimeString}**`;

        if (isSlash) {
            await input.editReply({ content: responseText });
        } else {
            // Pour le mode préfixe, on modifie le message de réponse
            await sent.edit(responseText);
        }
    },
};