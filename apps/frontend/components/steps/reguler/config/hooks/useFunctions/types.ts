/**
 * Types for the useFunctions hok
 */

import { YCAction, YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";

/**
 * @param networks - Networks that a function must be available on one of
 * @param tokens - Functions must only outflow these tokens, no thers.
 * @param action - Functions only that relate to this action
 */
export interface UseFunctionsProps {
  networks?: YCNetwork[];
  tokens?: YCToken[];
  action?: YCAction;
  protocols?: YCProtocol[]
}
