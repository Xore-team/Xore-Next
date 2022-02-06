import { ClientEvents } from "discord.js";
import XoreClient from "../client/XoreClient";

type EventRun<T extends keyof ClientEvents> = (instance: XoreClient, ...data: ClientEvents[T]) => void | any;

export = class Event<T extends keyof ClientEvents> {
    public event: T;
    public run: EventRun<T>;
    public isDispatch: boolean;

    constructor(event: T, runner: EventRun<T>) {
        this.event = event;
        this.run = runner;
        this.isDispatch = false;
    }
}