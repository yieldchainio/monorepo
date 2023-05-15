/**
 * Update a tree's parents (Shall be done for easier debugging)
 */

import { YCStep } from "@yc/yc-models";

export function updateParents(tree: YCStep) {
  tree.map((step) => {
    for (const child of step.children) child.parent = step;
  });
}
