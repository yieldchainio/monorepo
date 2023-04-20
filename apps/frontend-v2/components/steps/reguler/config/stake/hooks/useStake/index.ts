/**
 * Utility custom hook to use for staking configs
 */

import { Step } from "utilities/classes/step";
import { useConfigContext } from "../../../hooks/useConfigContext";
import { useProtocols } from "../../../hooks/useProtocols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { STAKE_ID } from "components/steps/reguler/constants";
import { YCFunc, YCProtocol } from "@yc/yc-models";
import { StakeData } from "./types";
import { useFunctions } from "../../../hooks/useFunctions";

export const useStake = ({
  step,
  triggerComparison,
}: {
  step: Step;
  triggerComparison: () => void;
}) => {
  /**
   * Get some base variables that we need (context, network & our available tokens)
   */
  const { context, network, availableTokens } = useConfigContext({
    step,
    triggerComparison,
  });

  /**
   * States to keep track of the chosen tokens and protocol
   */
  const [protocol, setProtocol] = useState<YCProtocol | null>(null);
  const [stakeFunction, setStakeFunction] = useState<YCFunc | null>();

  /**
   * Get our stake action (memoize it)
   */
  const stakeAction = useMemo(
    () => context.getAction(STAKE_ID) || undefined,
    []
  );

  /**
   * Get all protocols with stake functions avaialble
   */
  const protocols = useProtocols({
    networks: network ? [network] : undefined,
    action: stakeAction,
  });

  /**
   * Get all stake functions that are under our chosen protocol
   */
  const functions = useFunctions({
    networks: network ? [network] : undefined,
    tokens: availableTokens,
    protocols: protocol ? [protocol] : [],
    action: stakeAction,
  });

  /**
   * Methods for setting the states
   */

  // Choose a protocol
  const chooseProtocol = useCallback(
    (protocol: YCProtocol) => {
      (step.data.stake as StakeData) = {
        ...(step.data?.stake || {}),
        protocol: protocol.toJSON(),
      };

      console.log("Just Set Protocol ser");
      step.protocol = protocol;

      triggerComparison();
    },
    [JSON.stringify(step.toJSON())]
  );

  // Choose a function
  const chooseFunction = useCallback(() => {
    (func: YCFunc) => {
      (step.data.stake as StakeData) = {
        ...(step.data?.stake || {}),
        func: func.toJSON(),
      };

      step.function = func;
    };
  }, [JSON.stringify(step.toJSON())]);

  /**
   * Initiallize the choices from persistance if not yet
   */
  useEffect(() => {
    // Shorthand for the data
    const data = step.data.stake as StakeData | null;
    if (data?.func) setStakeFunction(new YCFunc(data.func, context));
    if (data?.protocol) setProtocol(new YCProtocol(data.protocol, context));
  }, [step.data.stake?.protocol?.id, step.data.stake?.func?.id]);

  // Return the functions & variables
  return {
    chooseProtocol,
    protocols,
    protocol,
    network,
    chooseFunction,
    functions,
    stakeFunction,
  };
};
