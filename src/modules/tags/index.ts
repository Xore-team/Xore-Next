import Module from "../Module.base";
import TagCreate from "./Create";
import TagDelete from "./Delete";
import TagEdit from "./Edit";
import Tag from "./Tag";
import TagList from "./TagList";

export = new Module({
    name: "tags",
    can_be_disabled: true,
    enabled: true,
    emoji: "🏷",
    init() {
        return [
            new TagCreate(),
            new TagDelete(),
            new Tag(),
            new TagList(),
            new TagEdit()
        ];
    }
});