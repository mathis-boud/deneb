const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Affiche ton niveau et ton XP actuelle.')
        .addUserOption(option => option.setName('membre').setDescription('Le membre à consulter')),

    async execute(interaction) {
        await interaction.deferReply();
        const target = interaction.options.getUser('membre') || interaction.user;
        const data = db.prepare("SELECT * FROM levels WHERE userId = ?").get(target.id) || { xp: 0, level: 1 };

        const canvas = createCanvas(900, 250);
        const ctx = canvas.getContext('2d');

        // Fond sombre
        ctx.fillStyle = '#23272a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Barre de progression vide
        ctx.fillStyle = '#484b4e';
        ctx.beginPath();
        ctx.roundRect(250, 160, 600, 40, 20);
        ctx.fill();

        // Barre de progression pleine
        const progress = (data.xp / (data.level * 1000)) * 600;
        ctx.fillStyle = '#00d2ff';
        ctx.beginPath();
        ctx.roundRect(250, 160, progress, 40, 20);
        ctx.fill();

        // Textes
        ctx.font = 'bold 40px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(target.username, 250, 80);

        ctx.font = '30px sans-serif';
        ctx.fillText(`Niveau : ${data.level}`, 250, 130);
        ctx.fillText(`${data.xp} / ${data.level * 1000} XP`, 630, 130);

        // Avatar
        const avatar = await loadImage(target.displayAvatarURL({ extension: 'png', size: 256 }));
        ctx.save();
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 25, 200, 200);
        ctx.restore();

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank.png' });
        await interaction.editReply({ files: [attachment] });
    },
};