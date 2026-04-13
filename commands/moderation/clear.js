const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre précis de messages.')
        .addIntegerOption(option => 
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(input, args) {
        const isSlash = input.isChatInputCommand !== undefined;
        const amount = isSlash ? input.options.getInteger('nombre') : parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            const errorMsg = 'Tu dois choisir un nombre entre 1 et 100.';
            // Ici le reply fonctionne car le message n'est pas encore supprimé
            return isSlash ? input.reply({ content: errorMsg, ephemeral: true }) : input.reply(errorMsg);
        }

        try {
            const deleteAmount = isSlash ? amount : amount + 1;
            const messages = await input.channel.bulkDelete(deleteAmount, true);
            const count = isSlash ? messages.size : messages.size - 1;

            const response = `**${count}** messages supprimés !`;

            if (isSlash) {
                await input.reply({ content: response, ephemeral: true });
            } else {
                // --- LA CORRECTION EST ICI ---
                // On utilise .send() au lieu de .reply() car le message d'origine a été supprimé
                const reply = await input.channel.send(response);
                setTimeout(() => reply.delete().catch(() => null), 10000);
            }
        } catch (error) {
            console.error(error);
            const errorText = 'Erreur : je ne peux pas supprimer les messages de plus de 14 jours.';
            if (isSlash) {
                input.reply({ content: errorText, ephemeral: true });
            } else {
                // Ici aussi, on utilise channel.send par sécurité
                input.channel.send(errorText);
            }
        }
    },
};