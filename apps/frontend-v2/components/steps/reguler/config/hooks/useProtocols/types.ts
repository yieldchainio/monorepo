/**
 * Types for the useProtocols hook
 */

import { YCAction, YCNetwork, YCToken } from "@yc/yc-models";
import { ProtocolType } from "@prisma/client";
export interface UseProtocolsProps {
  networks?: YCNetwork[];
  tokens?: YCToken[];
  type?: ProtocolType;
  action?: YCAction;
  actionTokens?: YCToken[];
}
