const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yt-gen')
        .setDescription('Génère une miniature YouTube sans aucun fichier externe.')
        .addStringOption(option => option.setName('titre').setDescription('Le titre de la vidéo').setRequired(true))
        .addStringOption(option => option.setName('theme').setDescription('Couleur dominante').addChoices(
            { name: 'Rouge Feu', value: '#ff4b2b' },
            { name: 'Bleu Électrique', value: '#00d2ff' },
            { name: 'Violet Néon', value: '#a832ad' }
        )),

    async execute(interaction) {
        await interaction.deferReply();

        const title = interaction.options.getString('titre').toUpperCase();
        const themeColor = interaction.options.getString('theme') || '#ff4b2b';

        try {
            const canvas = createCanvas(1280, 720);
            const ctx = canvas.getContext('2d');

            // 1. CRÉATION DU FOND (Dégradé radial dynamique)
            const bgGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 100, canvas.width/2, canvas.height/2, 800);
            bgGradient.addColorStop(0, themeColor);
            bgGradient.addColorStop(1, '#000000');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. AJOUT DE MOTIFS GÉOMÉTRIQUES (Lignes de vitesse)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 200, canvas.height);
                ctx.stroke();
            }

            // 3. CHARGEMENT DE L'AVATAR
            const avatarImg = await loadImage(interaction.user.displayAvatarURL({ extension: 'png', size: 512 }));
            
            // Effet de lueur derrière l'avatar
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 50;
            
            // Dessin de l'avatar en grand à droite
            const avSize = 450;
            ctx.drawImage(avatarImg, 750, 135, avSize, avSize);
            
            // Reset de l'ombre pour le texte
            ctx.shadowBlur = 0;

            // 4. TEXTE STYLE "YOUTUBE" (Gros, penché et gras)
            ctx.rotate(-0.05); // Légère inclinaison pour le style
            
            // Ombre portée du texte
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.font = 'bold 110px Sans-serif';
            ctx.fillText(title, 65, 365); // Ombre

            ctx.fillStyle = '#ffffff';
            ctx.fillText(title, 60, 360); // Texte principal

            // 5. BANDEAU DE DÉTAIL
            ctx.rotate(0.05); // Reset rotation
            ctx.fillStyle = themeColor;
            ctx.fillRect(60, 400, 400, 10);

            // 6. ENVOI
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'yt-generated.png' });
            await interaction.editReply({ files: [attachment] });

        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Erreur lors de la génération graphique.");
        }
    }
};