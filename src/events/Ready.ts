import Event from "./Event";

export = new Event("ready", async (instance, client) => {
    console.log(`Ready on ${client.user.username}`);

    let uncguilds = await instance.prisma.uncachedGuilds.findMany();

    if (Array.isArray(uncguilds) && uncguilds.length) {
        for (let { guild_id } of uncguilds) {
            if (!client.guilds.cache.has(guild_id)) {
                await instance.prisma.uncachedGuilds.delete({ where: { guild_id } });
                console.log(`Deleted unknown guild ${guild_id}`);
            }
        }
    }

    for (let [guild_id] of client.guilds.cache) {
        // When the guild is uncached while running, we can grab the guilds id from the database
        if (!uncguilds.find((val) => val.guild_id === guild_id)) {
            await instance.prisma.uncachedGuilds.create({ data: { guild_id } });
        }
    }

    client.user.setPresence({
        status: "online",
        activities: [{
            name: `${client.guilds.cache.size} guild${client.guilds.cache.size > 1 ? "s" : ""}`,
            type: "WATCHING"
        }]
    });
});