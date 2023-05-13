/**
 * Construcable node class
 */
import { Node } from "./plain.js";
export interface NodeConstruct<T> {
    children: T[];
    parent?: T | null;
}
export declare class ConstructableNode<T extends Node<T>> extends Node<T> {
    constructor(tree: NodeConstruct<any>);
}
