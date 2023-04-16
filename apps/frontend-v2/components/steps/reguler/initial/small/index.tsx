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

export const SmallChooseAction = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    const actions = useActions();

    /**
     * We change our default dimensions on mount, this is because we do not comply with the reguler,
     * default dimensions
     */
    useEffect(() => {
      step.defaultDimensions = {
        [StepSizing.SMALL]: { width: 246, height: 112.5 },
        [StepSizing.MEDIUM]: {
          width: 327,
          height: 225,
        },
      };
      step.resize(StepSizing.SMALL);

      return () => {
        step.defaultDimensions = DefaultDimensions;
      };
    }, []);

    // Return the JSX
    return (
      <div
        className="w-[246px] h-[112.5px] flex flex-col items-center justify-start px-4 py-2.5 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder animate-stepPopup transition duration-200 ease-in-out gap-3"
        style={style}
        ref={ref}
        {...props}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <WrappedText fontSize={12}>Select Action</WrappedText>
          <StepOptions step={step} triggerComparison={triggerComparison} />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full overflow-scroll scrollbar-hide">
          {actions.map((action) => {
            return (
              <InfoProvider contents={action.name}>
                <div className="bg-custom-componentbg rounded-large flex flex-col gap-2 items-center justify-center py-3 group hover:bg-opacity-50 transition duration-200 ease-in-out">
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
      </div>
    );
  }
);
