import { Message, MessageEmbed, MessageEmbedOptions, PermissionString } from "discord.js";
import { readFileSync } from "fs";
import XoreClient from "../client/XoreClient";
import Util from "../Util";

export class Command<E extends CommandEmbedFunction = CommandEmbedFunction> implements CommandOptions {
    public data: CommandOptions = Util.pull<CommandOptions>(defaultOptions);
    public embeds: {[embed: string]: MessageEmbed} = {};
    module: string | undefined;
    
    public setup(options: CommandOptions) {
        this.data = Util.pull(options);

        this.module = options.module ?? "NONE";
    }

    get name() {
        return this.data.name;
    }

    get description() {
        return this.data.description;
    }

    get sendTyping() {
        return this.data.sendTyping ?? false;
    }

    get permissions() {
        return Object.assign({ 
            client: [] as PermissionString[], 
            user: [] as PermissionString[]
        }, this.data.permissions);
    }

    get beDisabled() {
        return this.data.beDisabled ?? true;
    }

    get emotes() {
        return JSON.parse(readFileSync("./src/emotes.json", "utf-8")) as EmoteData;
    }

    public onCommandLoad() {}

    public loadEmbeds(embedFun: E) {
        for (let [name, data] of Object.entries(embedFun(MessageEmbed))) {
            this.embeds[name] = data;
        }
    }

    public run(ctx: CommandCtx) {}
}

let defaultOptions: CommandOptions = {
    name: "None",
    description: "(NO DESCRIPTION)",
}

type CommandEmbedFunction = (embed: typeof MessageEmbed) => { 
    [key: string]: MessageEmbed 
};

interface EmoteData {
    yes: string;
    no: string;
    maybe: string;
}

interface CommandOptions {
    name: string;
    description: string;
    sendTyping?: boolean;
    module?: string;
    beDisabled?: boolean;
    permissions?: {
        client?: PermissionString[];
        user?: PermissionString[];
    }
}

export interface CommandCtx {
    message: Message;
    client: XoreClient;
    args: string[];
}