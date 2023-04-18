/**
 * useExchanges,
 * provides all YC-integrated DEXs
 *
 * @param networks - Optional. Filter exchanges so that they must be avaialble on atleast one of these networks
 * @default all
 *
 * @param tokens - Optional. Filter exchanges so that they must have liquidity for all of these tokens available
 * @default none
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { UseExchangesProps } from "./types";
import { useMemo } from "react";
import { ProtocolType } from "@prisma/client";

export const useExchanges = ({ networks, tokens }: UseExchangesProps) => {
  /**
   * Get all global protocols
   */
  const protocols = useYCStore((state) => state.context.protocols);

  /**
   * Run a memoization on the filtered protocols
   */

  const exchanges = useMemo(
    () =>
      // Filter based on protocol type
      protocols.filter(
        // Protocol must be an exchange
        (protocol) =>
          protocol.type === ProtocolType.EXCHANGE &&
          // Networks provided must be undefined, or the protocol's networks must include one of them
          (!networks
            ? true
            : protocol.networks.some((network) =>
                networks.some((_network) => _network.id == network.id)
              )) &&
          (!tokens
            ? true
            : tokens.flatMap((filterToken) => {
                protocol.tokens.some((token) => token.id === filterToken.id)
                  ? [true]
                  : [false];
              }).length === tokens.length)
      ),
    [protocols, protocols.length]
  );

  // Return the exchanges
  return exchanges;
};
