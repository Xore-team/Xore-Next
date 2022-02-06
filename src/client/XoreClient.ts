import { PrismaClient } from "@prisma/client";
import { Collection } from "discord.js"
import { Command } from "../modules/Command.base"
import Module from "../modules/Module.base";
import Util from "../Util";
import BaseXoreClient from "./BaseXoreClient";

export = class XoreClient {
    public commands: Collection<string, Command>;
    public modules: Collection<string, Module>;

    public mode: "DEV" | "PROD";

    public instance: BaseXoreClient;

    public prisma: PrismaClient;

    public constructor() {
        this.commands = new Collection();
        this.modules = new Collection();

        this.instance = new BaseXoreClient({
            dir: Util.arr(["build", "src", "modules/"])
        }, this);

        this.prisma = new PrismaClient();

        this.mode = process.env.MODE && process.env.MODE === "dev" ? "DEV" : "PROD";

        this.instance.loadEvents();
    }

    public async connectDB() {
        return (this.prisma.$connect() as Promise<any>)
             .then(() => {});
    }

    getToken() {
        return new Promise<string>((resolve, reject) => {
            let token = process.env[this.mode === "DEV" ? "BETA_TOKEN" : "TOKEN"];
            if (!token) {
                reject(`${typeof token} is not found`);
            }
            resolve(token as string);
        });
    }
}