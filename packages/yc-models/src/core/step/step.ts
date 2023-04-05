import { DBStep } from "../../types";
import { YCAction } from "../action/action";
import { BaseClass } from "../base";
import { YCClassifications } from "../context/context";
import { YCFlow } from "../flow/flow";
import { YCFunc } from "../function/function";
import { YCProtocol } from "../protocol/protocol";

export class YCStep extends BaseClass {
  id: string;
  protocol: YCProtocol | null;
  inflows: YCFlow[] = [];
  outflows: YCFlow[] = [];
  children: YCStep[] = [];
  percentage: number;
  action: YCAction | null;
  function: YCFunc | null;
  parentId: string | null;
  customArguments: any[];

  constructor(_step: DBStep, _context: YCClassifications) {
    super();
    this.id = _step.id;
    this.parentId = _step.parentId;
    this.protocol = _context.getProtocol(_step.protocol);
    this.inflows = _step.inflows.flatMap((flowId: string) => {
      const flow = _context.getFlow(flowId);
      return flow ? [flow] : [];
    });
    this.outflows = _step.outflows.flatMap((flowId: string) => {
      const flow = _context.getFlow(flowId);
      return flow ? [flow] : [];
    });
    this.children = _step.children.map(
      (child: DBStep) => new YCStep(child, _context)
    );

    this.percentage = _step.percentage;
    this.action = _context.getAction(_step.action);
    this.function = _context.getFunction(_step.function);
    this.customArguments = _step.customArgs;
  }

  /**
   * Convert the step into a JSON step
   */

  toJSON = (): DBStep => {
    return {
      id: this.id,
      parentId: this.parentId,
      action: this.action?.id || "",
      protocol: this.protocol?.id || "",
      percentage: this.percentage,
      inflows: this.inflows.map((flow) => flow.id),
      outflows: this.outflows.map((flow) => flow.id),
      function: this.function?.id || "",
      customArgs: this.customArguments,
      children: this.children.map((child) => child.toJSON()),
    };
  };

  // ===================
  //    TREE METHODS
  // ===================

  /**
   * Standard hierarchy iteration function,
   * goes floor-by-floor
   */
  each = (callback: (step: YCStep) => any) => {
    // Create a stack array
    const stack: YCStep[] = [this];

    // While it's length is bigger than 0, pop a step,
    // invoke the callback on it, and then add all of it's children to the stack
    while (stack.length > 0) {
      const node = stack.pop() as YCStep;
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
  eachBefore = (callback: (step: YCStep) => any): void => {
    callback(this);
    for (const child of this.children) child.eachBefore(callback);
  };

  /**
   * find
   * Iterates over the tree to find a step corresponding to a callback check, and returns it (or null if not found)
   */
  find = (condition: (step: YCStep) => boolean): YCStep | null => {
    // Create a stack array
    const stack: YCStep[] = [this];

    // While it's length is bigger than 0, pop a step,
    // invoke the condition on it. If true, return the node - otherwise, add all of it's children to the stack (to keep looping)
    while (stack.length > 0) {
      const node = stack.pop() as YCStep;
      const res = condition(node);
      if (res) return node;

      for (const child of node.children) {
        stack.push(child);
      }
    }
    // return null if we found none that answer our condition
    return null;
  };
}
