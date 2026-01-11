
import { Client, GatewayIntentBits, ChannelType } from "discord.js";

const TOKEN = process.env.DISCORD_TOKEN || "";
const GUILD_ID = "1459461146472874057";
const OLD_CHANNEL_NAME = "novel-alerts";
const NEW_FORUM_NAME = "📚-novels-library";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    const guild = await client.guilds.fetch(GUILD_ID);
    if (!guild) {
        console.error("Guild not found!");
        process.exit(1);
    }

    // 1. Find and delete old text channel
    const oldChannel = guild.channels.cache.find(c => c.name === OLD_CHANNEL_NAME);
    if (oldChannel) {
        console.log(`Deleting old channel: ${oldChannel.name} (${oldChannel.id})`);
        await oldChannel.delete("Replacing with Forum channel");
    } else {
        console.log("Old channel not found or already deleted.");
    }

    // 2. Find parent category (Information & News)
    const category = guild.channels.cache.find(c => c.name === "📢 Information & News" && c.type === ChannelType.GuildCategory);

    // 3. Create Forum Channel
    console.log(`Creating Forum Channel: ${NEW_FORUM_NAME}...`);
    const forum = await guild.channels.create({
        name: NEW_FORUM_NAME,
        type: ChannelType.GuildForum,
        parent: category?.id,
        topic: "Library of all active novels. Follow your favorites!",
        availableTags: [
            { name: "Fantasy", emoji: "⚔️" },
            { name: "Romance", emoji: "💖" },
            { name: "Sci-Fi", emoji: "🚀" },
            { name: "Drama", emoji: "🎭" },
            { name: "Completed", emoji: "✅" },
            { name: "New", emoji: "🆕" }
        ] as any
    });

    console.log(`SUCCESS! Forum Created. ID: ${forum.id}`);

    await client.destroy();
    process.exit(0);
});

client.login(TOKEN);
