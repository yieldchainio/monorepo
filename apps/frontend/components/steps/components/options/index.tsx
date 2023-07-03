/**
 * A component for the 3-dotted options of a complete step, that show a dropdown to edit,
 * delete, expand/minimize, etc
 */

import {
  DBFunction,
  EncodingContext,
  YCClassifications,
  YCFunc,
} from "@yc/yc-models";
import { DotMenuIcon } from "components/icons/dot-menu";
import { StepProps } from "components/steps/types";
import { TooltipDropdown } from "components/tooltip-dropdown";
import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { useLogs } from "utilities/hooks/stores/logger";
import { useStepOptions } from "utilities/hooks/yc/useSteps/useStepsOptions";

export const StepOptions = ({ ...props }: any) => {
  const { step, triggerComparison } = useStepContext();
  // Get the options to display
  const options = useStepOptions({ step });

  // Get the canvas portal
  const canvasPortal = useCanvasPortal();

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
          // props.onClick?.();
          // const jsonFunc = step.function?.toJSON(true) as DBFunction;

          // step.function = new YCFunc(jsonFunc, YCClassifications.getInstance());

          // const jsonStep = step.toDeployableJSON();

          // if (!jsonStep)
          //   throw logs.lazyPush({
          //     message: "JSON Step is Null!",
          //     type: "error",
          //   });
          console.log(step);
          // console.log(
          //   step.function?.encodeYCCommand(jsonStep, EncodingContext.SEED, [
          //     ...step.customArguments,
          //   ])
          // );
        }}
      ></DotMenuIcon>
    </TooltipDropdown>
  );
};
