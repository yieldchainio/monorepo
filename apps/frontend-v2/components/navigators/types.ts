/**
 * types for the navigators component
 */

import { configProgressStep } from "utilities/hooks/stores/strategies/types";

export interface NavigatorsProps {
  next: () => void;
  prev: () => void;
  steps: configProgressStep[];
  nextCallback: (configIndex: number) => void;
  prevCallback: (configIndex: number) => void;
  currentIndex: number
}
