const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { creatorId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Exécute du code JavaScript en direct (DANGEREUX).')
        .addStringOption(option => option.setName('code').setDescription('Le code à tester').setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== creatorId) return interaction.reply({ content: "❌", flags: [MessageFlags.Ephemeral] });

        const code = interaction.options.getString('code');
        
        try {
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            interaction.reply({ content: `✅ **Résultat :**\n\`\`\`js\n${evaled.substring(0, 1900)}\n\`\`\``, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
            interaction.reply({ content: `❌ **Erreur :**\n\`\`\`js\n${err}\n\`\`\``, flags: [MessageFlags.Ephemeral] });
        }
    }
};