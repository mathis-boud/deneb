const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pkg = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('npm-check')
        .setDescription('Affiche les versions des dépendances installées.'),

    async execute(interaction) {
        const deps = pkg.dependencies;
        const depList = Object.entries(deps).map(([name, version]) => `**${name}**: \`${version}\``).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('📦 Dépendances du Projet')
            .setDescription(depList)
            .setColor('#9b59b6')
            .setFooter({ text: `Deneb Bot v${pkg.version}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};