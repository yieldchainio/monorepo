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
import { getRewardsFunction } from "../../utils/getRewardsFunction";
import { useLogs } from "utilities/hooks/stores/logger";
import { ErrorMessage } from "components/logger/components/error";

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
   * Get global logs to throw errors, messages
   */
  const logs = useLogs();

  /**
   * States to keep track of the chosen tokens and protocol
   */
  const [protocol, setProtocol] = useState<YCProtocol | null>(null);
  const [stakeFunction, setStakeFunction] = useState<YCFunc | null>(null);
  const [rewardsFunction, setRewardsFunction] = useState<YCFunc | null>(null);

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
    actionTokens: availableTokens,
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
    (_protocol: YCProtocol) => {
      // Whether or not the requested protocol is the same as the current one
      if (_protocol.id == protocol?.id) return;

      // Set the protocol on the step's data (persistant), and also reset the function to null
      step.data.stake = {
        ...(step.data?.stake || {}),
        protocol: _protocol.toJSON(),
        func: null,
      };

      // Reset the step's inflows & outflows (Since we changed our function)
      step.clearFlows();

      // // Reset the states (wont be auto updated by the side effect as it is nullish)
      setStakeFunction(null);
      setRewardsFunction(null);

      // Change the protocol of this step
      step.protocol = protocol;

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({}))]
  );

  // Choose a function
  const chooseFunction = useCallback(
    (func: YCFunc) => {
      // Change the stake data on the step (persistant)
      step.data.stake = {
        ...(step.data?.stake || {}),
        func: func.toJSON(),
      } as StakeData

      // Validate that we have all required outflows available
      if (
        func.outflows.find(
          (token) => !availableTokens.find((_token) => _token.id == token.id)
        )
      )
        logs.push((id: string) => ({
          component: (
            <ErrorMessage id={id}>
              You Do Not Have The Available Tokens For This Pool
            </ErrorMessage>
          ),
          id,
          lifespan: 4000,
          data: {},
        }));

      // Clear all existing outflows & inflows
      step.clearFlows();

      // Add all of the outflows to this step
      for (const token of func.outflows) step.addOutflow(token);

      // Add all of the inflows to this step
      for (const token of func.inflows) step.addInflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({}))]
  );

  /**
   * Initiallize the choices from persistance if not yet
   */
  useEffect(() => {
    // Shorthand for the data
    const data = step.data.stake;
    if (data?.func) {
      const stakeFunc = new YCFunc(data.func, context);
      const rewardsFunc = getRewardsFunction(stakeFunc, context);

      setStakeFunction(stakeFunc);
      setRewardsFunction(rewardsFunc);
    }
    if (data?.protocol) {
      const newProtocol = new YCProtocol(data.protocol, context);
      setProtocol(newProtocol);
      step.protocol = newProtocol;
    }
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
    rewardsFunction,
  };
};
