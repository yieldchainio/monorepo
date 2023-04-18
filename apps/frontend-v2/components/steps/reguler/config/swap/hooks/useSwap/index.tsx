/**
 * useSwap hook
 * Returns abstracted functions for making swaps
 */

import { DBToken, YCToken } from "@yc/yc-models";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Step } from "utilities/classes/step";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { SwapData } from "../../types";
import { useExchanges } from "../useExchanges";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const useSwap = ({
  step,
  triggerComparison,
}: {
  step: Step;
  triggerComparison: () => void;
}) => {
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

  /**
   * Get the avaialble exchnages
   */
  const exchanges = useExchanges({
    networks: network ? [network] : undefined,
    tokens: availableTokens,
  });

  /**
   * States to keep track of the from & to tokens
   */
  const [fromToken, setFromToken] = useState<YCToken | null>(null);
  const [toToken, setToToken] = useState<YCToken | null>(null);

  /**
   * Functions to handle token choices
   */
  const chooseFromToken = useCallback(
    (token: YCToken) => {
      // Assert that it must be available to us
      if (!availableTokens.find((_token) => _token.id === token.id))
        throw "Cannot Choose From Token - Token Is Unavailable At This Step";

      // Set the step's data to it (for persistant visual representation of the choice)
      (step.data.swap as SwapData) = {
        ...(step.data?.swap || {}),
        fromToken: token.toJSON(),
      };

      // Add this to the step's outflows
      step.addOutflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON())]
  );

  const chooseToToken = useCallback(
    (token: YCToken) => {
      // Set the step's data to it (for persistant visual representation of the choice)
      (step.data.swap as SwapData) = {
        ...(step.data?.swap || {}),
        toToken: token.toJSON(),
      };
      // Add this to the step's inflows
      step.addInflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON())]
  );

  /**
   * Initiallize the choices from persistance if not yet
   */
  useEffect(() => {
    // Shorthand for the data
    const data = step.data.swap as SwapData | null;

    // If our from token is not init yet
    // And there is a persisted DBtoken in the data,
    // Set our token to it
    if (data?.fromToken) setFromToken(new YCToken(data.fromToken, context));

    if (data?.toToken) setToToken(new YCToken(data.toToken, context));
  }, [
    step.data.swap,
    step.data.swap?.fromToken?.id,
    step.data.swap?.toToken?.id,
  ]);

  // Set the step's protocol to LiFi (The exchange)
  useEffect(() => {
    step.protocol = context.getProtocol("2d0a459a-7501-43a3-baba-da83801d5862");
  }, []);

  // Return the functions & variables
  return {
    chooseFromToken,
    chooseToToken,
    network,
    fromToken,
    toToken,
    availableTokens,
    exchanges,
  };
};
