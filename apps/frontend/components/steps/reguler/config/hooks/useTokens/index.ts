/**
 * useTokens,
 *
 * Get tokens according to some filters
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useMemo } from "react";
import { UseTokensProps } from "./types";

export function useTokens({ networks, tokens, protocols }: UseTokensProps) {
  /**
   * Get all global protocols
   */
  const allTokens = useYCStore((state) => state.context.tokens);

  /**
   * Run a memoization on the filtered tokens
   */
  const memoTokens = useMemo(() => {
    return allTokens.filter((token) => {
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
        !token.markets.some((protocol) =>
          protocols.some((_protocol) => _protocol.id == protocol.id)
        )
      )
        return false;

      return true;
    });
  }, [
    allTokens.length,
    allTokens,
    networks,
    networks?.length,
    tokens,
    tokens?.length,
    protocols,
    protocols?.length,
  ]);

  // Return the exchanges
  return memoTokens;
}