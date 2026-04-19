const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const dayjs = require('dayjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rappel')
        .setDescription('Créer un rappel complexe avec intervalles personnalisés.')
        .addStringOption(opt => opt.setName('titre').setDescription('Message du rappel').setRequired(true))
        .addStringOption(opt => opt.setName('heure').setDescription('Heure de début (HH:mm, ex: 07:00)').setRequired(true))
        .addStringOption(opt => opt.setName('intervalles').setDescription('Minutes entre les rappels (ex: 5,10,15)').setRequired(true)),

    async execute(input, args) {
        const isSlash = input.isChatInputCommand !== undefined;
        const titre = isSlash ? input.options.getString('titre') : args[0];
        const heureString = isSlash ? input.options.getString('heure') : args[1];
        const intervalsInput = isSlash ? input.options.getString('intervalles') : args[2];

        // 1. Analyse des intervalles (ex: "5,10,15" -> [5, 10, 15])
        const sequence = intervalsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        
        // 2. Calcul du premier rappel (Demain à l'heure H)
        const [h, m] = heureString.split(':').map(Number);
        let cible = dayjs().add(1, 'day').hour(h).minute(m).second(0);

        if (!cible.isValid()) return input.reply("❌ Heure invalide (HH:mm).");

        // 3. Sauvegarde en base de données
        // On stocke la séquence restante sous forme de texte (JSON)
        const userId = isSlash ? input.user.id : input.author.id;
        db.prepare(`
            INSERT INTO reminders (user_id, channel_id, titre, prochain_rappel, sequence_restante)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, input.channel.id, titre, cible.valueOf(), JSON.stringify(sequence));

        const embed = new EmbedBuilder()
            .setTitle("✅ Rappel Programmé")
            .setDescription(`**${titre}**`)
            .addFields(
                { name: 'Début', value: `Demain à ${heureString}`, inline: true },
                { name: 'Relances', value: sequence.length > 0 ? sequence.map(s => `+${s}min`).join(', ') : 'Aucune', inline: true }
            )
            .setColor('#00ff00');

        await input.reply({ embeds: [embed] });
    }
};