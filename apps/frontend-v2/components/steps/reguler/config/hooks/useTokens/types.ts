/**
 * types for the useTokens hook
 */

import { YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";
import { TokenTags } from "@prisma/client";

export interface UseTokensProps {
  tokens?: YCToken[];
  protocols?: YCProtocol[];
  networks?: YCNetwork[];
  tags?: TokenTags[];
}
