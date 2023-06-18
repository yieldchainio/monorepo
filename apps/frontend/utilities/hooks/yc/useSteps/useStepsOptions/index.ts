/**
 * A simple hook to extract the logic of using a steps's options bar,
 * like edit, delete, expand, etc.
 */

import { useMemo } from "react";
import { UseStepOptionsProps } from "./types";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import { changeStepState } from "components/steps/utils/handle-state-change";

export const useStepOptions = ({
  expand = true,
  minimize = true,
  deleteAble = true,
  edit = true,
  step,
}: UseStepOptionsProps) => {
  /**
   * Memoize the options
   */
  const options = useMemo(() => {
    // Determine expandability
    const expandable = step.size === StepSizing.SMALL;

    // Determine deleteability & editability
    const writeable = step.writeable;

    // Init the new options arr
    const newOptions = [];

    // Push expand if expanble,
    if (expandable && expand)
      newOptions.push({
        text: "Expand",
        data: {
          description: "Expand This Step",
          handler: () => {
            step.resize(StepSizing.MEDIUM, null, true);
          },
        },
      });
    // Else, push minimize
    else if (minimize)
      newOptions.push({
        text: "Minimize",
        data: {
          description: "Minimize This Step",
          handler: () => {
            step.resize(StepSizing.SMALL, null, true);
          },
        },
      });

    // Push deletability, editability (write actions)
    if (writeable) {
      if (edit && step.state == "complete")
        newOptions.push({
          text: "Edit",
          data: {
            description: "Edit This Step",
            handler: () => {
              changeStepState(step, "config");
            },
          },
        });

      if (deleteAble && step.parent)
        newOptions.push({
          text: "Delete",
          data: {
            description: "Delete This Step",
            handler: () => {
              step.parent?.removeChild(step.id);
            },
          },
        });
    }

    return newOptions;
  }, [step, JSON.stringify(step.toJSON({}))]);

  return options;
};
