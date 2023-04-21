/**
 * Small visual component for a deposit token on deposit trigger
 */

import { DBToken, YCToken } from "@yc/yc-models";
import { StepProps } from "components/steps/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { ImageProps } from "components/wrappers/types";
import { useMemo } from "react";
import { StepSizing } from "utilities/classes/step/types";

export const DepositTriggerToken = ({ step, triggerComparison }: StepProps) => {
  /**
   * Memoize component size
   */

  const size = useMemo(() => {
    if (step.size == StepSizing.MEDIUM)
      return {
        width: 40,
        height: 40,
      };

    if (step.size === StepSizing.SMALL)
      return {
        width: 30,
        height: 30,
      };
  }, [step, step.id, triggerComparison, step.size]);

  /**
   * Memoize font size for pluses
   */
  const fontSize = useMemo(() => {
    if (step.size === StepSizing.MEDIUM)
      return {
        fontA: 28,
        fontB: 26,
      };

    if (step.size === StepSizing.SMALL)
      return {
        fontA: 20,
        fontB: 18,
      };
  }, [step, step.id, triggerComparison, step.size]);

  /**
   * Memoize deposit token
   */
  const depositToken: DBToken | null = useMemo(() => {
    return (
      (
        step.data.trigger as {
          token: DBToken;
        } | null
      )?.token || null
    );
  }, []);

  // Return JSX
  return (
    <div
      className="flex flex-row items-center justify-center relative "
      style={{
        width: size?.width,
        height: size?.height,
      }}
    >
      <div className=" absolute bg-green-500 w-full h-full z-[-1] rounded-md filter blur-lg opacity-30"></div>
      <WrappedImage
        src={depositToken?.logo}
        className="w-full h-full rounded-full border-[1px] border-custom-bcomponentbg z-0"
      />
      <GreenPlus
        width={fontSize?.fontA}
        className="absolute top-[30%] rotate-[-10deg] left-[-15%] "
      />

      <GreenPlus
        width={fontSize?.fontA}
        className="absolute top-[-10%] rotate-[17deg] left-[80%]"
      />
    </div>
  );
};

const GreenPlus = ({ width, height, className, style }: ImageProps) => {
  return (
    <WrappedText
      fontColor="green-500"
      fontSize={width}
      className={
        "absolute drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] " +
        " " +
        (className || "")
      }
      style={style}
    >
      +
    </WrappedText>
  );
};
