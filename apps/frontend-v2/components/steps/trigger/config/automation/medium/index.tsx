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

export const MediumAutomationConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    const { chooseInterval, intervalInput, timestamp, chooseTimestamp } =
      useAutomation({ step, triggerComparison });
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
        <div className="w-full flex flex-row gap-2">
          <InfoProvider contents="HEy" direction={ToolTipDirection.LEFT}>
            <Dropdown
              options={[
                {
                  text: "Minutes",
                  image: undefined,
                  data: undefined,
                },
                {
                  text: "Hours",
                  image: undefined,
                  data: undefined,
                },
                {
                  text: "Days",
                  image: undefined,
                  data: undefined,
                },
                {
                  text: "Weeks",
                  image: undefined,
                  data: undefined,
                },
              ]}
              type="searchable"
              buttonProps={{
                style: {
                  width: "100%",
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
                text: timestamp,
                data: undefined,
              }}
              choiceHandler={() => null}
            ></Dropdown>
          </InfoProvider>
          <WrappedInput
            showGlass={false}
            type="number"
            placeholder="Choose Interval"
            defaultValue={intervalInput.toString()}
            min={1}
            onChange={(e) => chooseInterval(parseInt(e.target.value))}
          />
        </div>
      </BaseTriggerConfig>
    );
  }
);
