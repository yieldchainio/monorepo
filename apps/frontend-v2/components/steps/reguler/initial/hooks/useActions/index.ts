/**
 * useActions hook
 * extracts the logic of getting and filtering the available actions
 */

import { YCAction } from "@yc/yc-models";
import { useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { ACTION_IDS_TO_CONFIGS, ACTION_IDS_TO_ICONS } from "../../constants";

export const useActions = () => {
  // Get all of the available actions
  const allActions = useYCStore((state) => state.context.actions);

  // Memo the available ones
  const availableActions = useMemo(() => {
    return allActions
      .filter((action) => action.available === true)
      .map((action) => {
        action.icon = ACTION_IDS_TO_ICONS[action.id];
        action.component = ACTION_IDS_TO_CONFIGS[action.id];
        return action;
      });
  }, [allActions, allActions.length]);

  // return the actions
  return availableActions;
};