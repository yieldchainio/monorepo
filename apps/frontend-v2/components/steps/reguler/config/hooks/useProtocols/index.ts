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
      allProtocols.filter((protocol) => {
        // Protocol must the match provided type if any
        if (type && !protocol.types.some((_type) => _type === type))
          return false;

        // The protocol's networks must include atleast one of the provided networks, if any
        if (
          networks &&
          !protocol.networks.some((network) =>
            networks.some((_network) => network.id == _network.id)
          )
        )
          return false;

        // A protocol must include all of the requested tokens, if any
        if (
          tokens &&
          tokens.flatMap((token) =>
            protocol.tokens.some((_token) => token.id == _token.id)
              ? [true]
              : []
          ).length !== tokens.length
        )
          return false;

        // A protocol must include the provided action, if any
        if (
          action &&
          !protocol.addresses.find((address) =>
            address.functions.some((func) =>
              func.actions.some((_action) => _action.id == action.id)
            )
          )
        )
          return false;

        return true;
      }),
    [
      allProtocols,
      allProtocols.length,
      networks,
      networks?.length,
      tokens,
      tokens?.length,
      type,
      action,
      action?.id,
    ]
  );

  // Return the exchanges
  return protocols;
};
