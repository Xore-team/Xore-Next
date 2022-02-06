import { Command } from "./Command.base";

export = class Module implements ModuleOptions {
    public options: ModuleOptions;

    public constructor(options: ModuleOptions) {
        this.options = options;
    }

    get name(): string {
        return this.options.name;
    }

    get enabled(): boolean {
        return this.options.enabled;
    }

    get can_be_disabled() {
        return this.options.can_be_disabled ?? true;
    }

    get disabled_for_reason() {
        return this.options.disabled_for_reason ?? { 
            message: "This module is disabled globaly" 
        }
    }

    get emoji() {
        return this.options.emoji;
    }

    public init(): Command[] {
        return this.options.init() ?? [];
    }
}

interface ModuleOptions {
    name: string;
    enabled: boolean;
    can_be_disabled: boolean;
    disabled_for_reason?: {
        message: string;
    }
    emoji: string;
    init(): Array<Command>;
}