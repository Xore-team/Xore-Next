import { Client, MessageMentionOptions, PartialTypes, RateLimitData } from "discord.js";
import type { IntentsString } from "discord.js";
import { readdirSync } from "fs";
import Util from "../Util";
import Module from "../modules/Module.base";
import XoreClient from "./XoreClient";
import _ from "lodash";
import Event from "../events/Event";
import DispatchEvent from "../events/DispatchEvent";
import EventDispatcher from "../EventDispatcher";

class BaseXoreClient extends Client {
    public xoreOptions: ClientOptions;

    public base: XoreClient;

    public constructor(options: ClientOptions, base: XoreClient) {
        super({ intents, rejectOnRateLimit, allowedMentions, partials });

        this.xoreOptions = options;

        this.base = base;

        loadDirectory(options.dir, base);
    }

    loadEvents() {
        for (let file of readdirSync("./build/src/events").filter(f => f !== "Event.js")) {
            let d: Event<any> = require(`../events/${file}`);
            // Switching events based on which one is used in logging
            if (d.isDispatch && d instanceof DispatchEvent) {
                this.on(d.event, (...data) => d.run(this.base, new EventDispatcher(this), ...data));
            } else {
                this.on(d.event, (...data) => d.run(this.base, ...data));
            }
        }
    }
}

let allowedMentions: MessageMentionOptions = Util.pull<MessageMentionOptions>({
    parse: ["users"],
    repliedUser: true
});

let intents = Util.arr<IntentsString>([
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_PRESENCES",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_TYPING",
    "DIRECT_MESSAGE_REACTIONS",
]);

let partials = Util.arr<PartialTypes>([
    "CHANNEL",
    "MESSAGE",
    "USER"
]);

function rejectOnRateLimit(data: RateLimitData) {
    if (data.global) {
        return true;
    }

    return false;
}

function loadDirectory(dir: string[], xore: XoreClient) {
    let directory = _.join(dir, "/");
    readdirSync(directory).filter(f => !f.endsWith(".base.js")).forEach((folder) => {
        let index: Module = require(`../modules/${folder}/index`);
        xore.modules.set(index.name, index);
        for (let command of index.init()) {
            command.onCommandLoad();
            if (command.module === "NONE") {
                command.module = index.name;
            }
            xore.commands.set(command.name, command);
        }
    });
}

interface ClientOptions {
    dir: string[];
}

export = BaseXoreClient;