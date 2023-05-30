/**
 * Types for the useExchanges hook
 */

import { YCNetwork, YCToken } from "@yc/yc-models";

export interface UseExchangesProps {
  networks?: YCNetwork[];
  tokens?: YCToken[]
}

