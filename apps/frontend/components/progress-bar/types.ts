/**
 * Types for the incremental progress bar
 */

import { BaseComponentProps } from "components/types";
import { ImageSrc } from "components/wrappers/types";
import { configProgressStep } from "utilities/hooks/stores/strategies/types";

/**
 * @param state - The state of the step (Complete, not complete or currently active)
 * @param image - the image that will be visible when the step is active
 * @param label - the children (a title, or a title w a description, etc) that will be visible on a tooltip when
 * hovering over the step
 */
export type ProgressStep = {
  state: "complete" | "not_complete" | "active";
  image: string | ImageSrc
  label: React.ReactNode;
};
export interface IncrementalProgressBarProps extends BaseComponentProps {
  steps: configProgressStep[];
  color: string;
}
