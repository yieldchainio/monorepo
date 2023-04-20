/**
 * Types for the useStake hook
 */

import { DBFunction, DBProtocol } from "@yc/yc-models";

export interface StakeData {
  protocol: DBProtocol;
  func: DBFunction;
}
