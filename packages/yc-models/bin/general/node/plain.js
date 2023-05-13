export class Node {
    children = [];
    parent = null;
    /**
     * Standard hierarchy iteration function,
     * goes floor-by-floor
     */
    each = (callback) => {
        // Create a stack array
        const stack = [this];
        // While it's length is bigger than 0, pop a step,
        // invoke the callback on it, and then add all of it's children to the stack
        while (stack.length > 0) {
            const node = stack.pop();
            callback(node);
            for (const child of node.children) {
                stack.push(child);
            }
        }
    };
    /**
     * eachBefore
     * standard iteration breadth-first iteration method
     */
    eachBefore = (callback) => {
        callback(this);
        for (const child of this.children)
            child.eachBefore(callback);
    };
    /**
     * find
     * Iterates over the tree to find a step corresponding to a callback check, and returns it (or null if not found)
     */
    find = (condition) => {
        // Create a stack array
        const stack = [this];
        // While it's length is bigger than 0, pop a step,
        // invoke the condition on it. If true, return the node - otherwise, add all of it's children to the stack (to keep looping)
        while (stack.length > 0) {
            const node = stack.pop();
            const res = condition(node);
            if (res)
                return node;
            for (const child of node.children) {
                stack.push(child);
            }
        }
        // return null if we found none that answer our condition
        return null;
    };
    /**
     * Map
     * standard mapping function for the tree
     */
    map = (callback) => {
        // Create a stack array
        const stack = [this];
        const result = [];
        // While it's length is bigger than 0, pop a step,
        // invoke the callback on it, and then add all of it's children to the stack
        let i = 0;
        while (stack.length > 0) {
            const node = stack.pop();
            result.push(callback(node, i));
            for (const child of node.children) {
                stack.push(child);
            }
            i++;
        }
        return result;
    };
    /**
     * Returns leaf nodes of this tree
     */
    get leaves() {
        const leafNodes = [];
        this.eachBefore((step) => step.children.length == 0 ? leafNodes.push(step) : null);
        return leafNodes;
    }
}
//# sourceMappingURL=plain.js.map