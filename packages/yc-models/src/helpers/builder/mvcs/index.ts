/**
 * Map function IDs => MVC Builders
 */

import { YCFunc, YCStep } from "../../../core/index.js";
import { YcCommand, bytes } from "../../../types/index.js";
import { buildLifiswapMVC } from "./mvc-builders/lifi.js";

const SIGS_TO_MVC_BUILDERS: Record<
  string,
  (step: YCStep) => bytes | YcCommand
> = {
  lifiSwap: buildLifiswapMVC,
  lifiSwapReverse: buildLifiswapMVC,
};

export function buildMVC(step: YCStep): YcCommand {
  if (!step.function?.signature)
    throw "Cannot Build MVC If Function Does Not Exist";

  const builder = SIGS_TO_MVC_BUILDERS[step.function.signature];
  if (!builder)
    throw (
      "Cannot Build MVC - Builder does not exist for function: " +
      step.function.signature
    );

  return builder(step);
}
