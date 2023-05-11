/**
 * Construcable node class
 */

import { Node } from "./plain";

export interface NodeConstruct<T> {
  children: T[];
  parent?: T | null;
}

export class ConstructableNode<T extends Node<T>> extends Node<T> {
  constructor(tree: NodeConstruct<any>) {
    super();
    this.children = tree.children;
    this.parent = tree.parent || null;
    for (const entry of Object.entries(tree))
      if (entry[0] == "children" || entry[0] == "parent") continue;
      // @ts-ignore
      else this[entry[0]] = entry[1];
  }
}
