export class Node<T extends Node<T>> {
    children: T[] = [];
    parent: T | null = null;
  
    /**
     * Standard hierarchy iteration function,
     * goes floor-by-floor
     */
    each = (callback: (step: T) => any) => {
      // Create a stack array
      const stack: T[] = [this as unknown as T];
  
      // While it's length is bigger than 0, pop a step,
      // invoke the callback on it, and then add all of it's children to the stack
      while (stack.length > 0) {
        const node = stack.pop() as T;
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
    eachBefore = (callback: (step: T) => any): void => {
      callback(this as unknown as T);
      for (const child of this.children) child.eachBefore(callback);
    };
  
    /**
     * find
     * Iterates over the tree to find a step corresponding to a callback check, and returns it (or null if not found)
     */
    find = (condition: (step: T) => boolean): T | null => {
      // Create a stack array
      const stack: T[] = [this as unknown as T];
  
      // While it's length is bigger than 0, pop a step,
      // invoke the condition on it. If true, return the node - otherwise, add all of it's children to the stack (to keep looping)
      while (stack.length > 0) {
        const node = stack.pop() as T;
        const res = condition(node);
        if (res) return node;
  
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
  
    map = <R>(callback: (step: T, i: number) => R): R[] => {
      // Create a stack array
      const stack: T[] = [this as unknown as T];
      const result: R[] = [];
  
      // While it's length is bigger than 0, pop a step,
      // invoke the callback on it, and then add all of it's children to the stack
      let i = 0;
      while (stack.length > 0) {
        const node = stack.pop() as T;
        result.push(callback(node, i));
  
        for (const child of node.children) {
          stack.push(child);
        }
        i++;
      }
  
      return result;
    };


    /**
     * Returns leaf node
     */
  }