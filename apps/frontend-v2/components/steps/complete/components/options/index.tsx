/**
 * A component for the 3-dotted options of a complete step, that show a dropdown to edit,
 * delete, expand/minimize, etc
 */

import { DotMenuIcon } from "components/icons/dot-menu";
import { TooltipDropdown } from "components/tooltip-dropdown";
import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";
import { useStepOptions } from "utilities/hooks/yc/useSteps/useStepsOptions";

export const CompleteStepOptions = ({
  step,
  ...props
}: { step: Step } & BaseComponentProps) => {
  // Get the options to display
  const options = useStepOptions({ step });

  // Return the JSX
  return (
    <TooltipDropdown options={options} handleChoice={(choice: any) => null}>
      <DotMenuIcon
        iconClassname="text-custom-textColor text-opacity-30 group-hover:text-opacity-50 transition duration-200 ease-linear"
        className="cursor-pointer group transition duration-200 ease-in-out"
        onClick={() => {
          props.onClick?.();
          console.log(step);
        }}
      ></DotMenuIcon>
    </TooltipDropdown>
  );
};
