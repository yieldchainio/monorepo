/**
 * types for the useTokens hook
 */

import { YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";

export interface UseTokensProps {
  tokens?: YCToken[];
  protocols?: YCProtocol[];
  networks?: YCNetwork[];
}
