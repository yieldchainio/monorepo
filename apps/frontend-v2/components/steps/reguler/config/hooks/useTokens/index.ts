/**
 * useTokens,
 *
 * Get tokens according to some filters
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useMemo } from "react";
import { UseTokensProps } from "./types";

export const useTokens = ({ networks, tokens, protocols }: UseTokensProps) => {
  /**
   * Get all global protocols
   */
  const allTokens = useYCStore((state) => state.context.tokens);

  /**
   * Run a memoization on the filtered tokens
   */
  const memoTokens = useMemo(
    () =>
      allTokens.filter((token) => {
        // If we got an array of fixed tokens, the token must be present there
        if (tokens && !tokens.find((_token) => _token.id == token.id))
          return false;

        // The token must be present within our provided networks, if any
        if (
          networks &&
          !networks.find((_network) => _network.id === token.network?.id)
        )
          return false;

        // The token must be included in atleast one of the provided protocols, if any
        if (
          protocols &&
          !protocols.find((protocol) =>
            protocol.tokens.some((_token) => _token.id === token.id)
          )
        )
          return false;

        return true;
      }),
    [
      allTokens.length,
      allTokens,
      networks,
      networks?.length,
      tokens,
      tokens?.length,
      protocols,
      protocols?.length,
    ]
  );

  // Return the exchanges
  return memoTokens;
};
