/**
 * A Small "Choose Action" component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useActions } from "../hooks/useActions";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import WrappedText from "components/wrappers/text";
import { StepOptions } from "components/steps/components/options";
import WrappedImage from "components/wrappers/image";
import { InfoProvider } from "components/info-providers";
import { BaseNode } from "components/steps/components/node";
import { ACTION_IDS_TO_CONFIGS, ACTION_IDS_TO_ENUM_KEY } from "../constants";

export const SmallChooseAction = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    // Get the available actions from our hook
    const actions = useActions();

    // Return the JSX
    return (
      <BaseNode
        className="flex-col px-4 py-2.5 gap-3"
        style={style}
        ref={ref}
        {...props}
        width="246px"
        height="112.5px"
        step={step}
        triggerComparison={triggerComparison}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <WrappedText fontSize={12}>Select Action</WrappedText>
          <StepOptions step={step} triggerComparison={triggerComparison} />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full overflow-scroll scrollbar-hide">
          {actions.map((action) => {
            return (
              <InfoProvider contents={action.name}>
                <div
                  className="bg-custom-componentbg rounded-large flex flex-col gap-2 items-center justify-center py-3 group hover:bg-opacity-50 transition duration-200 ease-in-out"
                  onClick={() => {
                    const enumKey = ACTION_IDS_TO_ENUM_KEY[action.id];
                    if (enumKey === undefined)
                      throw (
                        "Cannot Use Action - Undefined Enum Key For: " +
                        action.id
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
                </div>
              </InfoProvider>
            );
          })}
        </div>
      </BaseNode>
    );
  }
);
