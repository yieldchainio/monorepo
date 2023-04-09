/**
 * A small complete step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { CompleteStepSizedProps } from "../types";
import WrappedText from "components/wrappers/text";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";
import { forwardRef, useMemo } from "react";
import { DotMenuIcon } from "components/icons/dot-menu";
import { TooltipDropdown } from "components/tooltip-dropdown";
import { data } from "@yc/yc-models";
import {
  DefaultDimensions,
  StepSizing,
  StepState,
} from "utilities/classes/step/types";

export const SmallCompleteStep = forwardRef<
  HTMLDivElement,
  CompleteStepSizedProps
>(({ step, style, ...props }: CompleteStepSizedProps, ref) => {
  // Memoize this step's options, depending on it's writeability
  const options = useMemo(() => {
    const newOptions = [
      {
        text: "Expand",
        data: {
          description: "Expand This Step",
          handler: () => {
            step.resize(
              StepSizing.MEDIUM,
              DefaultDimensions[StepSizing.MEDIUM],
              true
            );
          },
        },
      },
    ];
    if (step.writeable)
      newOptions.push(
        {
          text: "Edit",
          data: {
            description: "Edit This Step",
            handler: () => {
              // step.changeState(Ste);
              // TODO:
            },
          },
        }
        // {
        //   text: "Delete",
        //   data: {
        //     description: "Delete This Step",
        //   },
        // }
      );

    return newOptions;
  }, [step.writeable]);
  return (
    <div
      className="w-[246px] h-[56px] flex flex-row items-center justify-start gap-2 px-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl"
      style={style}
      ref={ref}
      {...props}
    >
      <WrappedImage
        src={step.protocol?.logo}
        width={22}
        height={22}
        className="rounded-full"
      />
      <div className="flex flex-row w-[70%] items-center gap-2 bg-custom-componentbg px-3 rounded-lg  py-0.5 border-[1px] border-custom-themedBorder">
        <WrappedText fontSize={12} className="w-[60%] truncate">
          {step.action?.name}
        </WrappedText>
        <div className="flex flex-row items-center justify-between w-full ">
          {!step.inflows.length ? null : (
            <InflowTokenBundle
              tokens={step.inflows.map((flow) => flow.token)}
            />
          )}
          {!step.outflows.length ? null : (
            <OutflowTokenBundle
              tokens={step.outflows.map((flow) => flow.token)}
            />
          )}
        </div>
      </div>
      <TooltipDropdown options={options} handleChoice={(choice: data) => null}>
        <DotMenuIcon
          iconClassname="text-custom-textColor text-opacity-30 group-hover:text-opacity-50 transition duration-200 ease-linear"
          className="cursor-pointer group transition duration-200 ease-in-out"
          onClick={props.onClick}
        ></DotMenuIcon>
      </TooltipDropdown>
    </div>
  );
});
