/**
 * Types for the edge components
 */

import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";

export type Position = {
  x: number;
  y: number;
};

export interface HeadEdgeProps {
  parentStep: Step;
  childStep: Step;
}

export interface DirectedEdgeProps extends BaseComponentProps, HeadEdgeProps {
  parentAnchor: Position;
  childAnchor: Position;
}
