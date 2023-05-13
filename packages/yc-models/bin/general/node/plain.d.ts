export declare class Node<T extends Node<T>> {
    children: T[];
    parent: T | null;
    /**
     * Standard hierarchy iteration function,
     * goes floor-by-floor
     */
    each: (callback: (step: T) => any) => void;
    /**
     * eachBefore
     * standard iteration breadth-first iteration method
     */
    eachBefore: (callback: (step: T) => any) => void;
    /**
     * find
     * Iterates over the tree to find a step corresponding to a callback check, and returns it (or null if not found)
     */
    find: (condition: (step: T) => boolean) => T | null;
    /**
     * Map
     * standard mapping function for the tree
     */
    map: <R>(callback: (step: T, i: number) => R) => R[];
    /**
     * Returns leaf nodes of this tree
     */
    get leaves(): T[];
}
