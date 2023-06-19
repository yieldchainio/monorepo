/**
 * A Small "Choose Action" component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useContext, useEffect, useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useActions } from "../hooks/useActions";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import WrappedText from "components/wrappers/text";
import { StepOptions } from "components/steps/components/options";
import WrappedImage from "components/wrappers/image";
import { InfoProvider } from "components/info-providers";
import { BaseNode } from "components/steps/components/node";
import { ACTION_IDS_TO_ENUM_KEY } from "../../constants";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { changeStepState } from "components/steps/utils/handle-state-change";
import {
  StepContext,
  useStepContext,
} from "utilities/hooks/contexts/step-context";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";

/* eslint-disable react/display-name */
export const SmallChooseAction = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step, style, triggerComparison } = useStepContext();

    // Get the available actions from our hook
    const actions = useActions();

    // Get the canvas portal for tooltip
    const canvasPortal = useCanvasPortal();

    // Return the JSX
    return (
      <BaseNode
        className="flex-col px-4 py-2.5 gap-3"
        ref={ref}
        {...props}
        width="246px"
        height="112.5px"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <WrappedText fontSize={12}>Select Action</WrappedText>
          <StepOptions />
        </div>
        <div
          className="grid grid-cols-3 pt-0.5 px-2 gap-2 w-full h-full overflow-y-scroll overflow-x-visible scrollbar-hide"
          data-wheelable={false}
        >
          {actions.map(({ action, speciallyUnlocked }, i) => {
            return (
              <InfoProvider
                contents={
                  action.name +
                  (speciallyUnlocked ? " - Actions Available!" : "")
                }
                portal={canvasPortal}
                key={`${i}`}
              >
                <div
                  className="relative overflow-visible w-full h-full"
                  data-wheelable={false}
                >
                  {speciallyUnlocked && (
                    <div className="cursor-default absolute  overflow-x-visible isolate left-[100%] translate-x-[-65%] z-100 translate-y-[-30%] top-[0px] flex h-3 w-3">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></div>
                    </div>
                  )}
                  <div
                    className="h-full w-full bg-custom-componentbg rounded-large flex flex-col gap-2 items-center justify-center py-3 group hover:bg-opacity-50 transition duration-200 ease-in-out cursor-pointer"
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
                    data-wheelable={false}
                  >
                    <WrappedImage
                      src={action.icon}
                      width={20}
                      height={20}
                      className="group-hover:scale-[1.1] transition duration-300 ease-in-out will-change-transform"
                      wheelable={false}
                    />
                  </div>
                </div>
              </InfoProvider>
            );
          })}
        </div>
      </BaseNode>
    );
  }
);
