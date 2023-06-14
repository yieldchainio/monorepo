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
import { useProtocols } from "../../../hooks/useProtocols";

export function useExchanges({ networks, tokens }: UseExchangesProps) {
  /**
   * Get all exchanges
   */
  const exchanges = useProtocols({
    networks,
    tokens,
    type: ProtocolType.EXCHANGE,
  });

  // Return the exchanges
  return exchanges;
}
