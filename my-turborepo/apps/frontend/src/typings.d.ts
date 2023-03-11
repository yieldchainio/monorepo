declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "d3-flextree" {
  import { HierarchyNode } from "d3-hierarchy";
  import { Selection } from "d3-selection";

  // export interface FlextreeOptions {
  //   nodeSize?: [number, number];
  //   spacing?: (a: HierarchyNode<any>, b: HierarchyNode<any>) => number;
  //   separation?: (a: HierarchyNode<any>, b: HierarchyNode<any>) => number;
  //   nodeSizeAccessor?: (node: HierarchyNode<any>) => [number, number];
  //   spacingAccessor?: (a: HierarchyNode<any>, b: HierarchyNode<any>) => number;
  //   separationAccessor?: (
  //     a: HierarchyNode<any>,
  //     b: HierarchyNode<any>
  //   ) => number;
  //   align?: "UL" | "UR" | "DL" | "DR";
  //   size?: [number, number];
  //   f?: number;
  //   fAccessor?: (node: HierarchyNode<any>) => number;
  //   transform?: (node: HierarchyNode<any>, x: number, y: number) => void;
  // }

  export function flextree(options?: FlextreeOptions): any;
}
