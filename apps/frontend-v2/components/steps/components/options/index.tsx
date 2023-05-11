/**
 * A component for the 3-dotted options of a complete step, that show a dropdown to edit,
 * delete, expand/minimize, etc
 */

import { EncodingContext } from "@yc/yc-models";
import { DotMenuIcon } from "components/icons/dot-menu";
import { StepProps } from "components/steps/types";
import { TooltipDropdown } from "components/tooltip-dropdown";
import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { useLogs } from "utilities/hooks/stores/logger";
import { useStepOptions } from "utilities/hooks/yc/useSteps/useStepsOptions";

export const StepOptions = ({
  step,
  triggerComparison,
  canvasID,
  ...props
}: StepProps) => {
  // Get the options to display
  const options = useStepOptions({ step });

  // Get the canvas portal
  const canvasPortal = useElementPortal(canvasID);

  const logs = useLogs();

  // Return the JSX
  return (
    <TooltipDropdown
      options={options}
      handleChoice={(choice: any) => triggerComparison()}
      portal={canvasPortal}
    >
      <DotMenuIcon
        iconClassname="text-custom-textColor text-opacity-30 group-hover:text-opacity-50 transition duration-200 ease-linear"
        className="cursor-pointer group transition duration-200 ease-in-out"
        onClick={() => {
          props.onClick?.();
          const jsonStep = step.toJSON({ onlyCompleted: true });
          if (!jsonStep)
            throw logs.lazyPush({
              message: "JSON Step is Null!",
              type: "error",
            });
          console.log(step);
          console.log(
            step.function?.encodeYCCommand(jsonStep, EncodingContext.SEED, [
              ...step.customArguments,
            ])
          );
        }}
      ></DotMenuIcon>
    </TooltipDropdown>
  );
};
