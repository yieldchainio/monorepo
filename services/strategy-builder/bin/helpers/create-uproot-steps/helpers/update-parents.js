/**
 * Update a tree's parents (Shall be done for easier debugging)
 */
export function updateParents(tree) {
    tree.map((step) => {
        for (const child of step.children)
            child.parent = step;
    });
}
//# sourceMappingURL=update-parents.js.map