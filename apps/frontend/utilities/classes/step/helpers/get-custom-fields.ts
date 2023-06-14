/**
 * Construct a tree of custom arguments by a YC function, recursively
 * @param func - The YC function instance to get the custom values of, in a recrusive way
 * @param preConfigures - This within the recursion (should be added when doing the root),
 * where an argument is found to be a function - We are inputted the custom args it has preconfigured for it
 * @return CustomArgsTree
 */

import { YCFunc } from "@yc/yc-models";

export function getCustomFields(func: YCFunc): Array<null> {
  const customFields: Array<null> = [];
  for (const arg of func.arguments) if (arg.isCustom) customFields.push(null);
  return customFields;
}
