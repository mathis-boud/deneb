const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('anna').setDescription('Une commande comme une autre'),
	async execute(interaction) {
		await interaction.reply('Jtm <@288374913352335361> <3');
	},
};