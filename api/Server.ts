import express from "express";
import XoreClient from "../src/client/XoreClient";

export = class Server {
    public app = express();

    public bot: XoreClient;

    public constructor(bot: XoreClient) {
        this.bot = bot;

        this.run({ port: 3000 });
    }

    private run({ port }: { port: number }) {}
}