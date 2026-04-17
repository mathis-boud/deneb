const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pendu')
        .setDescription('Lance une partie de pendu !'),

    async execute(interaction) {
        const mots = ["DENEB", "DISCORD", "JAVASCRIPT", "SERVEUR", "BOT", "PROGRAMMATION"];
        const motAdeviner = mots[Math.floor(Math.random() * mots.length)];
        let lettresTrouvees = [];
        let erreurs = 0;
        const maxErreurs = 6;

        const generateDisplay = () => {
            return motAdeviner.split('').map(l => (lettresTrouvees.includes(l) ? l : '🟦')).join(' ');
        };

        const embed = new EmbedBuilder()
            .setTitle('🪓 Jeu du Pendu')
            .setDescription(`Devine le mot :\n\n${generateDisplay()}\n\nErreurs : **${erreurs}/${maxErreurs}**`)
            .setColor('#e67e22');

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        const filter = m => m.author.id === interaction.user.id && m.content.length === 1;
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', m => {
            const lettre = m.content.toUpperCase();
            m.delete().catch(() => {}); // On nettoie le chat

            if (lettresTrouvees.includes(lettre)) return;

            if (motAdeviner.includes(lettre)) {
                lettresTrouvees.push(lettre);
            } else {
                erreurs++;
            }

            const win = motAdeviner.split('').every(l => lettresTrouvees.includes(l));
            
            if (win) {
                embed.setTitle('🏆 Gagné !').setDescription(`Le mot était bien **${motAdeviner}** !`).setColor('#2ecc71');
                collector.stop();
            } else if (erreurs >= maxErreurs) {
                embed.setTitle('💀 Perdu !').setDescription(`Le mot était **${motAdeviner}**.`).setColor('#e74c3c');
                collector.stop();
            } else {
                embed.setDescription(`Devine le mot :\n\n${generateDisplay()}\n\nErreurs : **${erreurs}/${maxErreurs}**`);
            }

            message.edit({ embeds: [embed] });
        });
    },
};