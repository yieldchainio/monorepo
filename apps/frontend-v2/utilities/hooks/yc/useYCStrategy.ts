/**
 * @notice
 * A hook for consuming a YC strategy on the frontend.
 *
 * Provides all functions/details from the YCStrategy class, but in a stateful manner
 */

import { YCNetwork, YCStep, YCStrategy, YCToken, YCUser } from "@yc/yc-models";
import { useEffect, useState } from "react";
import { useYCStore } from "../stores/yc-data";

interface UseYCStrategyReturn {
  address?: string;
  id?: string;
  title?: string;
  depositToken?: YCToken;
  creator?: YCUser;
  network?: YCNetwork;
  verified?: boolean;
  tvl?: bigint;
  rootStep?: YCStep;
}

export const useYCStrategy = (strategyID: string): UseYCStrategyReturn => {
  /**
   * Global strategy instance
   */
  const [strategy, setStrategy] = useState<YCStrategy | undefined>();

  /**
   * Static info about the strategy (i.e 'endpoints')
   */
  const [address, setAddress] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [depositToken, setDepositToken] = useState<YCToken | undefined>();
  const [creator, setCreator] = useState<YCUser | undefined>();
  const [network, setNetwork] = useState<YCNetwork | undefined>();
  const [rootStep, setRootStep] = useState<YCStep | undefined>();
  const [verified, setVerified] = useState<boolean>(false);
  const [tvl, setTvl] = useState<bigint | undefined>();

  /**
   * Get the global YCContext store
   */
  const YCStrategies = useYCStore(
    (state) => state.context.YCstrategies,
    (prevStrats, currStrats) => {
      return (
        JSON.stringify(prevStrats.map((strat) => strat.toString())) ===
        JSON.stringify(currStrats.map((strat) => strat.toString()))
      );
    }
  );

  /**
   * useEffect to update the current strategy when the strategyID changes
   */
  useEffect(() => {
    // Find our strategy
    const currStrategy = YCStrategies.find((strat) => strat.id == strategyID);

    // Set the strategy globally to the state
    setStrategy(currStrategy);
  }, [strategyID]);

  /**
   * useEffect to update the strategy object every time strategies are updated, since the details may change
   */
  useEffect(() => {}, [
    JSON.stringify(YCStrategies.map((strat) => strat.toString())),
  ]);

  /**
   * useEffects used to populate the stateful fields on each change of the strategy
   */

  // Update the address
  useEffect(() => {
    setAddress(strategy?.address);
  }, [strategy?.address]);

  // Update the address
  useEffect(() => {
    setTitle(strategy?.title);
  }, [strategy?.title]);

  // Update the address
  useEffect(() => {
    setCreator(strategy?.creator || undefined);
  }, [strategy?.creator?.toString()]);

  // Update the address
  useEffect(() => {
    setNetwork(strategy?.network || undefined);
  }, [strategy?.network?.toString()]);

  // Update the address
  useEffect(() => {
    setDepositToken(strategy?.depositToken || undefined);
  }, [strategy?.depositToken?.id]);

  // Update the address
  useEffect(() => {
    setTvl(strategy?.tvl ? BigInt(strategy?.tvl) : undefined);
  }, [strategy?.tvl]);

  // TODO
  //   // Update the address
  //   useEffect(() => {
  //     setTvl(strategy?.tvl ? BigInt(strategy?.tvl) : undefined);
  //   }, [strategy?.steps]);
  // Update the address

  useEffect(() => {
    setVerified(strategy?.verified || false);
  }, [strategy?.verified]);

  // Return all of our details
  return {
    address,
    id: strategyID,
    title,
    depositToken,
    creator,
    network,
    verified,
    tvl,
    rootStep,
  };
};
