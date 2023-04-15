/**
 * A simple hook to extract the logic of using a steps's options bar,
 * like edit, delete, expand, etc.
 */

import { useMemo } from "react";
import { UseStepOptionsProps } from "./types";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";

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
            console.log("Running Expand Handler...");
            step.resize(
              StepSizing.MEDIUM,
              DefaultDimensions[StepSizing.MEDIUM],
              true
            );
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
            step.resize(
              StepSizing.SMALL,
              DefaultDimensions[StepSizing.SMALL],
              true
            );
          },
        },
      });

    // Push deletability, editability (write actions)
    if (writeable) {
      if (edit)
        newOptions.push({
          text: "Edit",
          data: {
            description: "Edit This Step",
            handler: () => {
              // step.changeState(Ste);
              // TODO:
            },
          },
        });

      if (deleteAble)
        newOptions.push({
          text: "Delete",
          data: {
            description: "Delete This Step",
            handler: () => {},
          },
        });
    }

    return newOptions;
  }, [step, JSON.stringify(step.toJSON())]);

  return options;
};