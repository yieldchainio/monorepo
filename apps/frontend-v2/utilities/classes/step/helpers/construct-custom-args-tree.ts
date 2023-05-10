/**
 * Construct a tree of custom arguments by a YC function, recursively
 * @param func - The YC function instance to get the custom values of, in a recrusive way
 * @param preConfigures - This within the recursion (should be added when doing the root),
 * where an argument is found to be a function - We are inputted the custom args it has preconfigured for it
 * @return CustomArgsTree
 */

import { CustomArgsTree, YCArgument, YCFunc } from "@yc/yc-models";

export function constructCustomArgsTree(
  func: YCFunc,
  preConfigures?: Array<YCArgument | null>
): CustomArgsTree[] {
  const root: CustomArgsTree[] = [];

  const premadeArgs: Array<YCArgument | null> =
    preConfigures || new Array<any>(func.customArgumentsLength()).fill(null);

  for (let i = 0; i < func.arguments.length; i++) {
    const arg = func.arguments[i];
    if (!arg.isCustom) continue;

    if (!(arg.value instanceof YCFunc))
      root.push({
        value: premadeArgs[i],
        customArgs: [],
        editable: arg.editable,
        preConfigured: premadeArgs[i] ? true : false,
      });
    else
      root.push({
        value: premadeArgs[i],
        customArgs: [
          ...constructCustomArgsTree(arg.value, arg.preconfiguredCustomValues),
        ],
        editable: arg.editable,
        preConfigured: premadeArgs[i] ? true : false,
      });
  }
  return root;
}
