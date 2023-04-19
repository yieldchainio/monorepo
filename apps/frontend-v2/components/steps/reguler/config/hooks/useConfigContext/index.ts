/**
 * @notice
 * useConfigContext
 * Provides shorthand variables, context & methods for action configs
 */

import { StepProps } from "components/steps/types";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const useConfigContext = ({ step, triggerComparison }: StepProps) => {
  /**
   * Get the global data context (passed onto creations of persisted tokens)
   */
  const context = useYCStore((state) => state.context);

  /**
   * Get the strategy's network
   */
  const network = useStrategyStore((state) => state.network);

  /**
   * Get the step's available tokens
   * // TODO: This looks inefficient since a decent amount of computation per render...
   * // TODO: Yet i cant think of a way to memo this as it is relaying on a lot of other variables.
   */
  const availableTokens = step.availableTokens;

  return { context, network, availableTokens };
};
