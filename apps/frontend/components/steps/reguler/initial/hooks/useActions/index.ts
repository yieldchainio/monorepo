/**
 * useActions hook
 * extracts the logic of getting and filtering the available actions
 */

import { YCAction } from "@yc/yc-models";
import { useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { ACTION_IDS_TO_ICONS } from "../../../constants";
import { useStepContext } from "utilities/hooks/contexts/step-context";

export function useActions() {
  // Get all of the available actions
  const allActions = useYCStore((state) => state.context.actions);

  const allFunctions = useYCStore((state) => state.context.functions);

  const { step } = useStepContext();

  // Memo the available ones
  const availableActions = useMemo(() => {
    return allActions.flatMap((action) => {
      const isAvailable = action.available === true;

      if (!isAvailable) return [];

      const actionFuncs = allFunctions.filter((func) =>
        func.actions.some((_action) => _action.id == action.id)
      );

      if (actionFuncs.length == 0) return [];

      const actionFunctions = actionFuncs.filter(
        (func) =>
          !func.dependencyFunction ||
          func.dependencyFunction.id == step.parent?.function?.id ||
          step?.parent?.unlockedFunctions.some(
            (unlockedFunc) => unlockedFunc.func.id == func.id
          )
      );

      const speciallyUnlockedFunctions = actionFuncs.filter(
        (func) =>
          (func.dependencyFunction?.id &&
            func?.dependencyFunction?.id == step.parent?.function?.id) ||
          step?.parent?.unlockedFunctions.some(
            (unlockedFunc) => unlockedFunc.func.id == func.id
          )
      );

      const isUnlocked = !!actionFunctions.length;

      if (isAvailable && isUnlocked) {
        action.icon = ACTION_IDS_TO_ICONS[action.id];
        return [
          {
            action,
            speciallyUnlocked: speciallyUnlockedFunctions.length > 0,
          },
        ];
      }

      return [];
    });
  }, [allActions, allActions.length]);

  // return the actions
  return availableActions;
}
