const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { creatorId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reboot')
        .setDescription('Redémarre le bot (Réservé au créateur).'),

    async execute(interaction) {
        // Sécurité : Seul toi peut l'utiliser
        if (interaction.user.id !== creatorId) {
            return interaction.reply({ 
                content: "❌ Tu n'as pas l'autorisation d'utiliser cette commande.", 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🔄 Redémarrage en cours...")
            .setDescription("Le bot va s'éteindre et être relancé par PM2. Je serai de retour dans quelques secondes !")
            .setColor('#f1c40f')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // On attend 1 seconde pour laisser le temps au message d'être envoyé
        setTimeout(() => {
            process.exit(); // Tue le processus
        }, 1000);
    }
};