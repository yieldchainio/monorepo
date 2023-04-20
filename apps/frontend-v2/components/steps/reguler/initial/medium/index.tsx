/**
 * A Medium "Choose Action" component
 */

import { StepOptions } from "components/steps/components/options";
import { StepProps } from "components/steps/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";
import { useActions } from "../hooks/useActions";
import { BaseNode } from "components/steps/components/node";
import { ACTION_IDS_TO_ENUM_KEY } from "../../constants";

export const MediumChooseAction = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    // Get the available actions
    const actions = useActions();

    // Return the JSX
    return (
      <BaseNode
        className="flex-col px-4 py-4 gap-3"
        style={style}
        ref={ref}
        {...props}
        width="327px"
        height="225px"
        step={step}
        triggerComparison={triggerComparison}
        canvasID={canvasID}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <WrappedText>Select Action</WrappedText>
          <StepOptions
            canvasID={canvasID}
            step={step}
            triggerComparison={triggerComparison}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full overflow-scroll scrollbar-hide">
          {actions.map((action) => {
            return (
              <div
                className="bg-custom-componentbg rounded-large flex flex-col gap-2 items-center justify-center py-3 group hover:bg-opacity-50 transition duration-200 ease-in-out"
                onClick={() => {
                  const enumKey = ACTION_IDS_TO_ENUM_KEY[action.id];
                  if (enumKey === undefined)
                    throw (
                      "Cannot Use Action - Undefined Enum Key For: " + action.id
                    );
                  step.actionConfig = enumKey;
                  step.action = action;
                  step.state = "config";
                  triggerComparison();
                }}
              >
                <WrappedImage
                  src={action.icon}
                  width={20}
                  height={20}
                  className="group-hover:scale-[1.05] transition duration-200 ease-in-out will-change-transform"
                />
                <WrappedText
                  fontSize={12}
                  className="truncate max-w-[80%] group-hover:scale-[1.05] transition duration-200 ease-in-out  will-change-transform"
                >
                  {action.name}
                </WrappedText>
              </div>
            );
          })}
        </div>
      </BaseNode>
    );
  }
);
