const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ----------------------
// Nachricht updaten
// ----------------------
async function updateStatsMessage(statsChannel, loginText, forumChannel) {
    // Existierende Stats-Nachricht holen oder neu erstellen
    let message;
    if (client.statsMessageId) {
        try {
            message = await statsChannel.messages.fetch(client.statsMessageId);
        } catch {
            message = null;
        }
    }

    if (!message) {
        const initialContent = `**Login-Statistiken**\nGesamt-Logins: 1\nUnique Logins: 1\nDurchschnittliche Screensize: 0x0`;
        message = await statsChannel.send(initialContent);
        client.statsMessageId = message.id;
    } else {
        const content = message.content;
        const loginMatch = content.match(/Gesamt-Logins:\s*(\d+)/);
        const screenMatch = content.match(/Durchschnittliche Screensize:\s*(\d+)x(\d+)/);

        let totalLogins = loginMatch ? parseInt(loginMatch[1]) : 0;
        let avgWidth = screenMatch ? parseInt(screenMatch[1]) : 0;
        let avgHeight = screenMatch ? parseInt(screenMatch[2]) : 0;

        totalLogins += 1;

        // IP und Screensize aus dem neuen Login
        const ipMatch = loginText.match(/IP:\s*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/i);
        const screenMatchNew = loginText.match(/Screen:\s*(\d+)x(\d+)/i);
        const newWidth = screenMatchNew ? parseInt(screenMatchNew[1]) : 0;
        const newHeight = screenMatchNew ? parseInt(screenMatchNew[2]) : 0;

        // Durchschnitt neu berechnen
        avgWidth = Math.round((avgWidth * (totalLogins - 1) + newWidth) / totalLogins);
        avgHeight = Math.round((avgHeight * (totalLogins - 1) + newHeight) / totalLogins);

        // Unique Logins: Threads im Forum zählen
        let uniqueLogins = 0;
        forumChannel.threads.cache.forEach(t => {
            uniqueLogins++;
        });

        // Prüfen, ob gerade neu ein Thread erstellt wird für diese IP
        if (ipMatch) {
            const existingThread = forumChannel.threads.cache.find(t => t.name === ipMatch[1]);
            if (!existingThread) {
                uniqueLogins += 1; // neue IP = unique login
            }
        }

        const newContent = `**Login-Statistiken**\n` +
                           `Gesamt-Logins: ${totalLogins}\n` +
                           `Unique Logins: ${uniqueLogins}\n` +
                           `Durchschnittliche Screensize: ${avgWidth}x${avgHeight}`;

        await message.edit(newContent);
    }
}

// ----------------------
// Bot ready
// ----------------------
client.once("ready", () => {
    console.log(`Bot online als ${client.user.tag}`);
});

// ----------------------
// Login-Channel überwachen
// ----------------------
client.on("messageCreate", async (msg) => {
    if (msg.channel.id !== config.loginChannelId) return;

    const statsChannel = client.channels.cache.get(config.statsChannelId);
    const forumChannel = client.channels.cache.get(config.forumChannelId);
    if (!statsChannel || !forumChannel) return;

    const ipMatch = msg.content.match(/IP:\s*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/i);
    if (!ipMatch) return;

    // Forum-Thread erstellen, wenn noch nicht vorhanden
    let thread = forumChannel.threads.cache.find(t => t.name === ipMatch[1]);
    if (!thread) {
        thread = await forumChannel.threads.create({
            name: ipMatch[1],
            message: { content: `Start für IP: **${ipMatch[1]}**` }
        });
    }
    await thread.send(`**Neue Login-Daten:**\n${msg.content}`);

    // Stats-Message aktualisieren
    await updateStatsMessage(statsChannel, msg.content, forumChannel);
});

client.login(config.token);
