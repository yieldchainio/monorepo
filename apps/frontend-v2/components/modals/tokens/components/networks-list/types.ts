/**
 * Types for the network card
 */

import { YCNetwork } from "@yc/yc-models";
import { BaseComponentProps } from "components/types";

export interface NetworkCardProps extends BaseComponentProps {
  network: YCNetwork;
  chosenNetwork: number;
  handler: (networkID: number) => void;
}
