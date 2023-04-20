/**
 * Custom hook to assert the amount of available tokens in add liquidity
 */

import { YCToken } from "@yc/yc-models";
import { cancelAction } from "components/steps/utils/cancel-action";
import { useEffect, useRef } from "react";
import { Step } from "utilities/classes/step";
import { useLogs } from "utilities/hooks/stores/logger";
import { WarningMessage } from "components/logger/components/warning";

export const useAssertTokensAmount = ({
  tokens,
  step,
  triggerComparison,
}: {
  tokens: YCToken[];
  step: Step;
  triggerComparison: () => void;
}) => {
  /**
   * @notice
   * We run a useEffect on the length of our available tokens.
   *
   * If the length is lower than 2, we cancel this action and log an error to the user
   */

  // Get the global logs store
  const logs = useLogs();
  const cancelled = useRef<boolean>(false);

  useEffect(() => {
    if (tokens.length < 0 && !cancelled.current) {
      cancelled.current = true;
      cancelAction(step, triggerComparison);
      logs.push((id: string) => {
        return {
          id,
          lifespan: 3000,
          component: (
            <WarningMessage id={id}>
              You Do Not Have Enough Tokens To Add Liquidity!
            </WarningMessage>
          ),
          data: null,
        };
      });
    }
  }, [tokens, tokens.length]);
};
