import Module from "../Module.base";
import Help from "./Help";
import Ping from "./Ping";
import Stats from "./Stats";

export = new Module({
    name: "core",
    enabled: true,
    can_be_disabled: false,
    emoji: "📕",
    init() {
        return [new Ping(), new Help(), new Stats()]
    }
});