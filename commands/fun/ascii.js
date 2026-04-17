const { SlashCommandBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Transforme ton texte en art ASCII.')
        .addStringOption(option => option.setName('texte').setDescription('Le texte à transformer').setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString('texte');

        figlet(text, (err, data) => {
            if (err) return interaction.reply({ content: "❌ Erreur de génération.", ephemeral: true });
            if (data.length > 2000) return interaction.reply({ content: "⚠️ Texte trop long !", ephemeral: true });

            interaction.reply(`\`\`\`\n${data}\n\`\`\``);
        });
    },
};