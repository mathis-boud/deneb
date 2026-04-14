const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dns = require('dns').promises;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dns')
        .setDescription('Vérifie l\'adresse IP d\'un domaine (Diagnostic réseau).')
        .addStringOption(option => 
            option.setName('domaine')
                .setDescription('Le domaine à vérifier (ex: google.com)')
                .setRequired(true)),

    async execute(interaction) {
        const domain = interaction.options.getString('domaine');
        
        await interaction.deferReply();

        try {
            const address = await dns.lookup(domain);
            
            const embed = new EmbedBuilder()
                .setTitle('🌐 Diagnostic DNS')
                .setColor('#2ecc71')
                .addFields(
                    { name: 'Domaine', value: `\`${domain}\``, inline: true },
                    { name: 'Adresse IPv4', value: `\`${address.address}\``, inline: true }
                )
                .setFooter({ text: 'Deneb Network Tool' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply(`❌ Impossible de résoudre le domaine \`${domain}\`. Vérifiez l'orthographe.`);
        }
    }
};