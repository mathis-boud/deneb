const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Lance une question de culture générale.'),

    async execute(interaction) {
        const questions = [
            { q: "Quelle est la capitale de l'Australie ?", a: "Canberra" },
            { q: "En quelle année est tombé le mur de Berlin ?", a: "1989" },
            { q: "Quel est le plus grand océan du monde ?", a: "Pacifique" },
            { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci" }
        ];

        const random = questions[Math.floor(Math.random() * questions.length)];
        
        const embed = new EmbedBuilder()
            .setTitle('🧠 Quiz Express !')
            .setDescription(`**Question :** ${random.q}\n\n*Tu as 15 secondes pour répondre !*`)
            .setColor('#3498db');

        await interaction.reply({ embeds: [embed] });

        // On crée un collecteur pour attendre la réponse
        const filter = m => m.content.toLowerCase() === random.a.toLowerCase();
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', m => {
            // Utilise followUp pour ne pas interférer avec le reply initial
            interaction.followUp(`🎉 Bravo <@${m.author.id}> ! La réponse était bien **${random.a}**.`);
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                // CORRECTION : random.a au lieu de random.random.a
                interaction.followUp(`⏰ Temps écoulé ! Personne n'a trouvé. La réponse était : **${random.a}**.`);
            }
        });
    },
};