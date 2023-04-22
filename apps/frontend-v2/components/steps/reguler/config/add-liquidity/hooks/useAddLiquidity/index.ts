/**
 * useSwap hook
 * Returns abstracted functions for making swaps
 */

import { YCProtocol, YCToken } from "@yc/yc-models";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Step } from "utilities/classes/step";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { AddLiquidityData } from "../../types";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useConfigContext } from "../../../hooks/useConfigContext";
import { useProtocols } from "../../../hooks/useProtocols";
import { ProtocolType } from "@prisma/client";
import { useToken } from "wagmi";
import { useTokens } from "../../../hooks/useTokens";

export const useAddLiquidity = ({
  step,
  triggerComparison,
}: {
  step: Step;
  triggerComparison: () => void;
}) => {
  /**
   * Get some base variables that we need (context, network & our available tokens)
   */
  const {
    context,
    network,
    availableTokens: stepAvailableTokens,
  } = useConfigContext({
    step,
    triggerComparison,
  });

  /**
   * Get all protocols with add liquidity available
   */
  const protocols = useProtocols({
    networks: network ? [network] : undefined,
    type: ProtocolType.LIQUIDITY,
  });

  /**
   * States to keep track of the chosen tokens and protocol
   */
  const [tokenA, setTokenA] = useState<YCToken | null>(null);
  const [tokenB, setTokenB] = useState<YCToken | null>(null);
  const [protocol, setProtocol] = useState<YCProtocol | null>(null);

  /**
   * Get all of our available tokens for this add liquidity operation
   */
  const availableTokens: YCToken[] = useTokens({
    networks: network ? [network] : undefined,
    tokens: stepAvailableTokens,
    // protocols: protocol ? [protocol] : [],
  });

  /**
   * Functions to handle token choices
   */
  const chooseTokenA = useCallback(
    (token: YCToken) => {
      // Assert that it must be available to us
      if (!availableTokens.find((_token) => _token.id === token.id))
        throw "Cannot Choose From Token - Token Is Unavailable At This Step";

      // Set the step's data to it (for persistant visual representation of the choice)
      (step.data.lp as AddLiquidityData) = {
        ...(step.data?.lp || {}),
        tokenA: token.toJSON(),
      };

      // Add this to the step's outflows
      step.addOutflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({onlyCompleted: false}))]
  );

  const chooseTokenB = useCallback(
    (token: YCToken) => {
      // Set the step's data to it (for persistant visual representation of the choice)
      (step.data.lp as AddLiquidityData) = {
        ...(step.data?.lp || {}),
        tokenB: token.toJSON(),
      };

      // Add this to the step's outflows
      step.addOutflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({}))]
  );

  const chooseProtocol = useCallback(
    (protocol: YCProtocol) => {
      (step.data.lp as AddLiquidityData) = {
        ...(step.data?.lp || {}),
        protocol: protocol.toJSON(),
      };

      step.protocol = protocol;

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({}))]
  );

  /**
   * Initiallize the choices from persistance if not yet
   */
  useEffect(() => {
    // Shorthand for the data
    const data = step.data.lp as AddLiquidityData | null;

    // If our from token is not init yet
    // And there is a persisted DBtoken in the data,
    // Set our token to it
    if (data?.tokenA) setTokenA(new YCToken(data.tokenA, context));

    if (data?.tokenB) setTokenB(new YCToken(data.tokenB, context));

    if (data?.protocol) {
      const newProtocol = new YCProtocol(data.protocol, context);
      setProtocol(newProtocol);
      step.protocol = newProtocol;
    }
  }, [
    step.data.lp?.protocol?.id,
    step.data.lp?.tokenA?.id,
    step.data.lp?.tokenB?.id,
  ]);

  // Return the functions & variables
  return {
    chooseProtocol,
    chooseTokenA,
    protocols,
    chooseTokenB,
    protocol,
    tokenA,
    tokenB,
    network,
    availableTokens,
  };
};
