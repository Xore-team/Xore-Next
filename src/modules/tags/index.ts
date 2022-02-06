import Module from "../Module.base";
import TagCreate from "./Create";
import TagDelete from "./Delete";

export = new Module({
    name: "tags",
    can_be_disabled: true,
    enabled: true,
    emoji: "🏷",
    init() {
        return [
            new TagCreate(),
            new TagDelete()
        ];
    }
});