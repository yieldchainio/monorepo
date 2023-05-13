/**
 * Construcable node class
 */
import { Node } from "./plain.js";
export class ConstructableNode extends Node {
    constructor(tree) {
        super();
        this.children = tree.children;
        this.parent = tree.parent || null;
        for (const entry of Object.entries(tree))
            if (entry[0] == "children" || entry[0] == "parent")
                continue;
            // @ts-ignore
            else
                this[entry[0]] = entry[1];
    }
}
//# sourceMappingURL=constructable.js.map