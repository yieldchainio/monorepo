/**
 * Medium-sized config for the automation trigger
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseTriggerConfig } from "../../base";
import WrappedInput from "components/wrappers/input";
import { useAutomation } from "../hooks/useAutomation";
import Dropdown from "components/dropdown";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { Timestamps } from "../types";

export const MediumAutomationConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Get the states & setters from the useAutomation hook
     */
    const { chooseInterval, intervalInput, timestamp, chooseTimestamp } =
      useAutomation({ step, triggerComparison });

    // Return JSX
    return (
      <BaseTriggerConfig
        className="flex-col px-0 py-2.5 gap-8 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="327px"
        height="220.5px"
        step={step}
        triggerComparison={triggerComparison}
        handleComplete={() => null}
      >
        <div className="w-[100%] flex flex-row gap-2 items-start ">
          <WrappedInput
            showGlass={false}
            type="number"
            placeholder="Choose Interval"
            defaultValue={intervalInput.toString()}
            // min={1}
            onChange={(e) => chooseInterval(parseInt(e.target.value))}
            className=" self-start w-[20%] pr-0"
            style={{
              width: "100%",
            }}
          />
          <InfoProvider contents="Timestamp" direction={ToolTipDirection.RIGHT}>
            <Dropdown
              options={Object.entries(Timestamps).map((tsEntry, i, arr) => {
                return {
                  text: tsEntry[1],
                  data: tsEntry[0] as Timestamps,
                };
              })}
              buttonProps={{
                style: {
                  width: "100%",
                  gap: "4px",
                  paddingRight: "30px",
                },
              }}
              menuProps={{
                style: {
                  height: "250px",
                  zIndex: 1000,
                  overflowY: "scroll",
                },
                className: "overflow-y-scroll scrollbar-hide",
              }}
              autoChoice={false}
              choice={{
                // @ts-ignore
                // This works fine but screams at me - ignoring
                text: Timestamps[timestamp as unknown as Timestamps],
                data: undefined,
              }}
              choiceHandler={(choice) => chooseTimestamp(choice.data)}
            ></Dropdown>
          </InfoProvider>
        </div>
      </BaseTriggerConfig>
    );
  }
);
