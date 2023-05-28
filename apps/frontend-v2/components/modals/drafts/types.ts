/**
 * Types for the drafts modal
 */

import { BaseComponentProps, BaseModalChildProps } from "components/types";
import {
  StrategyStoreConfigsUtilityState,
  StrategyStoreState,
  configProgressStep,
} from "utilities/hooks/stores/strategies/types";

export interface DraftsModalProps extends BaseModalChildProps {
  strategyDrafts: (StrategyStoreState & StrategyStoreConfigsUtilityState)[];
  initStrategy: (optionalRoutes?: configProgressStep[]) => void;
}
