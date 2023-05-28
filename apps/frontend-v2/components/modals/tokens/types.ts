/**
 * Types for the TokensModal
 */

import { YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";
import { BaseComponentProps, BaseModalChildProps } from "components/types";

/**
 * Props for the TokensModal component
 * @param allowedNetworks - Optional, an array of YCNetwork's
 * @default all
 *
 * @param allowedTokens - Optional, an array of YCToken's
 * @default all
 *
 * @param allowedMarkets - Optional, an array of YCProtocol's
 * @default all
 *
 * @param label - Optional, a label displayed on the modal (Can indiciate intent of the modal, i.e "Swap From", "Swap To", "Pay with", etc.)
 * @default "Swap"
 *
 * @param defaultNetwork - Optional, the default network to display
 * @default First network in the array of allowed networks
 * 
 * @param handleChoice - The callback that accepts a YCToken and handles the user's choice
 */
export interface TokensModalProps extends BaseComponentProps, BaseModalChildProps {
  allowedNetworks?: YCNetwork[];
  allowedTokens?: YCToken[];
  allowedMarkets?: YCProtocol[];
  defaultNetwork?: YCNetwork;
  label?: string;
  handleChoice: (token: YCToken) => void
}
