import dotenv from "dotenv";
dotenv.config();
import XoreClient from "../client/XoreClient";
import prefixes from "../prefixes";
import Event from "./Event";

export = new Event("messageCreate", async (xore, message) => {

    if (!message.guild) {
        return;
    };

    let prefixData = await xore.prisma.guildPrefixes.findFirst({
        where: {
            guild: message.guild.id,
        }
    });

    let moduleData = await xore.prisma.guildModuleSettings.findFirst({
        where: {
            guild: message.guild.id
        }
    });

    let commandData = await xore.prisma.guildCommandSettings.findFirst({
        where: {
            guild: message.guild.id
        }
    });

    let { prefix, args } = parseContent(message.content, prefixData?.prefix!, xore);

    if (!message.content.startsWith(prefix)) {
        return;
    }

    let command = xore.commands.get(args[0]);

    if (!command) {
        return;
    }

    if (command.module) {
        let module = xore.modules.get(command.module);

        if (!module) {
            return;
        }

        if (moduleData && moduleData.modules.length) {
            if (moduleData.modules.includes(module.name)) {
                return message.channel.send(`Module \`${module.name}\` is currently disabled in this guild`);
            }
        }
    }

    if (command.permissions) {
        if (command.permissions.client.length) {
            let cPermissions = [];
            for (let perm of command.permissions.client) {
                if (!message.guild.me?.permissions.has(perm)) {
                    cPermissions.push(perm);
                }
            }

            if (cPermissions.length) return;
        }
        if (command.permissions.user.length) {
            let uPermissions = [];
            for (let perm of command.permissions.user) {
                if (!message.member?.permissions.has(perm)) {
                    uPermissions.push(perm);
                }
            }

            if (uPermissions.length) return;
        }
    }

    if (commandData && commandData.commands.length) {
        if (commandData.commands.includes(command.name)) {
            return message.channel.send(`Command \`${command.name}\` is disabled for this guild`);
        }
    }
    if (command.sendTyping) {
        message.channel.sendTyping();
    }

    command.run({
        message,
        client: xore,
        args: args.slice(1)
    });
});

function parseContent(str: string, prefix: string, xore: XoreClient) {
    function createPrefix() {
        if (str.startsWith(`<@${process.env.CLIENT_ID}>`) || str.startsWith(`<@!${process.env.CLIENT_ID}>`)) {
            prefix = str.split(" ")[0].includes("!") ? `<@!${xore.instance.user?.id}>` : `<@${xore.instance.user?.id}>`;
        } else {
            prefixes.forEach(p => {
                if (str.startsWith(p)) {
                    prefix = p;
                }
            })
        }
    }

    if (!prefix) {
        createPrefix()!;
    }

    let args = str.slice(prefix?.length).trim().split(" ");
    return { prefix, args };
}