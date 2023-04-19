/**
 * useProtocols
 * allows the consumer to easily retreive some filtered protocols based on conditions
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";

import { UseProtocolsProps } from "./types";
import { useMemo } from "react";

export const useProtocols = ({
  networks,
  tokens,
  type,
  action,
}: UseProtocolsProps) => {
  /**
   * Get all global protocols
   */
  const allProtocols = useYCStore((state) => state.context.protocols);

  /**
   * Run a memoization on the filtered protocols
   */
  const protocols = useMemo(
    () =>
      // Filter based on protocol type
      allProtocols.filter(
        // Protocol must be match provided type if any
        (protocol) =>
          (type ? protocol.types?.some((_type) => _type === type) : true) &&
          // The protocol's networks must include atleast one of the provided networks, if any
          (networks
            ? protocol.networks.some((network) =>
                networks.some((_network) => _network.id == network.id)
              )
            : true) &&
          // A protocol must include all of the requested tokens, if any
          (tokens
            ? tokens.flatMap((filterToken) => {
                protocol.tokens.some((token) => token.id === filterToken.id)
                  ? [true]
                  : [false];
              }).length === tokens.length
            : true) &&
          (action
            ? protocol.addresses.find((address) =>
                address.functions.some((func) =>
                  func.actions.some((_action) => _action.id === action.id)
                )
              )
            : true)

        // A protocol must include the provided action, if any
      ),
    [
      allProtocols,
      allProtocols.length,
      networks,
      networks?.length,
      tokens,
      tokens?.length,
      type,
    ]
  );

  // Return the exchanges
  return protocols;
};
