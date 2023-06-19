/**
 * A Medium "Choose Action" component
 */

import { StepOptions } from "components/steps/components/options";
import { StepProps } from "components/steps/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { forwardRef, useContext } from "react";
import { useActions } from "../hooks/useActions";
import { BaseNode } from "components/steps/components/node";
import { ACTION_IDS_TO_ENUM_KEY } from "../../constants";
import { changeStepState } from "components/steps/utils/handle-state-change";
import { useStepContext } from "utilities/hooks/contexts/step-context";
import { InfoProvider } from "components/info-providers";

/* eslint-disable react/display-name */
export const MediumChooseAction = forwardRef<HTMLDivElement, StepProps>(
  ({ ...props }: StepProps, ref) => {
    // Get the available actions
    const actions = useActions();

    const { step, triggerComparison } = useStepContext();

    // Return the JSX
    return (
      <BaseNode
        className="flex-col px-4 py-4 gap-3 "
        ref={ref}
        {...props}
        width="327px"
        height="225px"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <WrappedText>Select Action</WrappedText>
          <StepOptions />
        </div>
        <div
          className="grid grid-cols-3 gap-2 w-full  pt-2 px-2 overflow-y-scroll overflow-x-visible scrollbar-hide"
          data-wheelable={false}
        >
          {actions.concat(actions).map(({ action, speciallyUnlocked }, i) => {
            return (
              <div
                className="relative overflow-visible w-full h-full"
                data-wheelable={false}
              >
                {speciallyUnlocked && (
                  <InfoProvider contents="Available Actions">
                    <div className="cursor-default absolute  overflow-x-visible isolate left-[100%] translate-x-[-65%] z-100 translate-y-[-30%] top-[0px] flex h-3 w-3">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></div>
                    </div>
                  </InfoProvider>
                )}
                <div
                  data-wheelable={false}
                  className="h-full w-full bg-custom-componentbg rounded-large flex flex-col gap-2 items-center justify-center py-3 group hover:bg-opacity-50 transition duration-200 ease-in-out cursor-pointer "
                  onClick={() => {
                    const enumKey = ACTION_IDS_TO_ENUM_KEY[action.id];
                    if (enumKey === undefined)
                      throw (
                        "Cannot Use Action - Undefined Enum Key For: " +
                        action.id
                      );
                    step.actionConfig = enumKey;
                    step.action = action;
                    changeStepState(step, "config");

                    triggerComparison();
                  }}
                  key={`${i}`}
                >
                  <WrappedImage
                    wheelable={false}
                    src={action.icon}
                    width={20}
                    height={20}
                    className="group-hover:scale-[1.1] transition duration-300 ease-in-out will-change-transform"
                  />
                  <WrappedText
                    data-wheelable={false}
                    fontSize={12}
                    className="truncate max-w-[80%] group-hover:scale-[1.10] transition duration-200 ease-in-out  will-change-transform"
                  >
                    {action.name}
                  </WrappedText>
                </div>
              </div>
            );
          })}
        </div>
      </BaseNode>
    );
  }
);
