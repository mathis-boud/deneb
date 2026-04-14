const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhook-send')
        .setDescription('Envoie un message via Webhook (Test de flux HTTP).')
        .addStringOption(option => option.setName('url').setDescription('URL du Webhook').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Contenu').setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) return interaction.reply({ content: "❌", flags: [MessageFlags.Ephemeral] });

        const url = interaction.options.getString('url');
        const content = interaction.options.getString('message');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: "Deneb System Monitor",
                    content: content
                })
            });

            if (response.ok) {
                await interaction.reply({ content: "✅ Webhook envoyé avec succès !", flags: [MessageFlags.Ephemeral] });
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
        } catch (error) {
            await interaction.reply({ content: `❌ Échec : ${error.message}`, flags: [MessageFlags.Ephemeral] });
        }
    }
};