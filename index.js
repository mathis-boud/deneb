const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

// --- BASE DE DONNÉES ---
const Database = require('better-sqlite3');
const db = new Database('database.sqlite'); // Un seul fichier pour tout

// Initialisation de la table des rappels
db.prepare(`
    CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        channel_id TEXT,
        titre TEXT,
        prochain_rappel INTEGER,
        sequence_restante TEXT
    )
`).run();

// Initialisation de la table de leveling
db.prepare("CREATE TABLE IF NOT EXISTS levels (userId TEXT PRIMARY KEY, xp INTEGER, level INTEGER)").run();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

const xpCooldowns = new Set();
client.commands = new Collection();

// --- CHARGEMENT DES COMMANDES ---
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// --- LOGIQUE DE PRÊT ET BOUCLE DE RAPPEL ---
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // Vérification des rappels toutes les 30 secondes
    setInterval(async () => {
        const now = Date.now();
        // On récupère les rappels expirés
        const reminders = db.prepare("SELECT * FROM reminders WHERE prochain_rappel <= ?").all(now);

        for (const r of reminders) {
            try {
                const channel = await client.channels.fetch(r.channel_id).catch(() => null);
                if (channel) {
                    await channel.send(`🔔 **RAPPEL :** <@${r.user_id}>, **${r.titre}** !`);
                }

                // Gestion de la séquence de relance (JSON parse car stocké en texte)
                let sequence = JSON.parse(r.sequence_restante);

                if (sequence && sequence.length > 0) {
                    // On récupère le prochain délai et on l'enlève de la liste
                    const prochainDelaiMinutes = sequence.shift();
                    const nouveauTimestamp = now + (prochainDelaiMinutes * 60000);

                    db.prepare("UPDATE reminders SET prochain_rappel = ?, sequence_restante = ? WHERE id = ?")
                      .run(nouveauTimestamp, JSON.stringify(sequence), r.id);
                } else {
                    // Plus de relances prévues, on supprime le rappel
                    db.prepare("DELETE FROM reminders WHERE id = ?").run(r.id);
                }
            } catch (error) {
                console.error("Erreur lors du traitement d'un rappel:", error);
            }
        }
    }, 30000);
});

// --- GESTION DES MESSAGES (PRÉFIXE +) ---
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = "+";
    
    // 1. LOGIQUE DES COMMANDES (+ ou Slash)
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);
        
        if (command) {
            try { await command.execute(message, args); } 
            catch (e) { console.error(e); message.reply('Erreur commande.'); }
        }
        return; // On s'arrête ici si c'était une commande (pas d'XP)
    }

    // 2. LOGIQUE DU LEVELING (Si ce n'est pas une commande)
    if (xpCooldowns.has(message.author.id)) return;

    let user = db.prepare("SELECT * FROM levels WHERE userId = ?").get(message.author.id);
    if (!user) {
        db.prepare("INSERT INTO levels (userId, xp, level) VALUES (?, 0, 1)").run(message.author.id);
        user = { xp: 0, level: 1 };
    }

    const xpGagne = Math.floor(Math.random() * 11) + 15;
    let newXp = user.xp + xpGagne;
    let newLevel = user.level;
    const xpNecessaire = newLevel * 1000;

    if (newXp >= xpNecessaire) {
        newLevel++;
        newXp = 0;
        message.reply(`🎉 Bravo <@${message.author.id}>, tu es niveau **${newLevel}** !`);
    }

    db.prepare("UPDATE levels SET xp = ?, level = ? WHERE userId = ?").run(newXp, newLevel, message.author.id);

    // Ajout du cooldown d'une minute
    xpCooldowns.add(message.author.id);
    setTimeout(() => xpCooldowns.delete(message.author.id), 60000);
});

// --- GESTION DES INTERACTIONS (SLASH) ---
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const messagePayload = { content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(messagePayload);
        } else {
            await interaction.reply(messagePayload);
        }
    }
});

client.login(token);