const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Affiche les performances techniques du bot et du serveur.'),

    async execute(interaction) {
        // Calcul de l'utilisation de la RAM
        const usage = process.memoryUsage().heapUsed / 1024 / 1024;
        const totalRam = os.totalmem() / 1024 / 1024 / 1024;
        
        // Calcul de l'uptime du bot
        let totalSeconds = (interaction.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600) % 24;
        let minutes = Math.floor(totalSeconds / 60) % 60;
        let seconds = Math.floor(totalSeconds % 60);

        const embed = new EmbedBuilder()
            .setTitle('📊 Statistiques Système')
            .setColor('#3498db')
            .addFields(
                { name: '🤖 Bot', value: `**Discord.js**: v${version}\n**Node.js**: ${process.version}\n**Uptime**: ${days}j ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: '💻 Serveur VPS', value: `**OS**: ${os.type()} ${os.release()}\n**RAM utilisée**: ${usage.toFixed(2)} MB\n**RAM totale**: ${totalRam.toFixed(2)} GB`, inline: true },
                { name: '🌍 Présence', value: `**Serveurs**: ${interaction.client.guilds.cache.size}\n**Utilisateurs**: ${interaction.client.users.cache.size}`, inline: false }
            )
            .setFooter({ text: 'Deneb OS Monitoring' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};