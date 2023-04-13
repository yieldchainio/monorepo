/**
 * A component for the next & prev buttons for the strategy config
 * (Navigators)
 */

import { NavigatorsProps } from "./types";
import WrappedImage from "components/wrappers/image";
import { RegulerButton } from "components/buttons/reguler";
import GradientButton from "components/buttons/gradient";
import { IncrementalProgressBar } from "components/progress-bar";
import { useMemo } from "react";
import { InfoProvider } from "components/info-providers";
import { useStrategyStore } from "utilities/hooks/stores/strategies";

export const Navigators = ({
  next,
  prev,
  steps,
  nextCallback,
  prevCallback,
}: NavigatorsProps) => {
  // Get the strategy store (to rerender and check continute conditions based on state changes)
  const strategyState = useStrategyStore((state) => state.title);

  // Get the current active step
  const activeStep = useMemo(() => {
    return steps.findLast((config) => config.progressStep.state === "active");
  }, [JSON.stringify(steps.map((step) => JSON.stringify(step)))]);

  // Memo if we can continue
  const canContinue = useMemo(() => {
    console.log("Condition update ser", activeStep?.condition(), strategyState);
    return activeStep?.condition() || "Please Complete This Step To Continue!";
  }, [activeStep?.condition()]);

  // Memo if we can go back
  const canPrev = useMemo(() => {
    if (activeStep?.route === steps[0].route)
      return "You Are Currently On The First Step!";
    return true;
  }, [activeStep, steps, steps.length]);

  return (
    <div className="absolute top-[85%] w-[40%]  z-10 flex flex-col gap-6 tablet:w-[80%]">
      <IncrementalProgressBar steps={steps} color="bg-blue-500" />
      <div className="flex flex-row gap-10">
        <PrevButton prev={prev} callback={prevCallback} enabled={canPrev} />
        <NextButton next={next} enabled={canContinue} callback={nextCallback} />
      </div>
    </div>
  );
};

const NextButton = ({
  next,
  enabled,
  callback,
}: {
  next: (callback?: (index: number) => void) => void;
  enabled: true | string;
  callback: (index: number) => void;
}) => {
  // Memoize the button to return (If to return a infoprovider, disabled button or enabled one)
  const buttonToReturn = useMemo(() => {
    if (enabled === true)
      return (
        <GradientButton
          style={{
            width: "50%",
          }}
          className="py-4"
          onClick={() => {
            next(callback);
          }}
        >
          Next Step
          <WrappedImage
            src={"/icons/dropdown-arrow-dark.svg"}
            width={26}
            height={26}
            className="rotate-[-90deg]"
          ></WrappedImage>
        </GradientButton>
      );

    return (
      <InfoProvider contents={enabled}>
        <div className="w-[50%] h-max">
          <GradientButton
            style={{
              width: "100%",
            }}
            className="py-4 opacity-40 pointer-events-none"
          >
            Next Step
            <WrappedImage
              src={"/icons/dropdown-arrow-dark.svg"}
              width={26}
              height={26}
              className="rotate-[-90deg]"
            ></WrappedImage>
          </GradientButton>
        </div>
      </InfoProvider>
    );
  }, [next, enabled, callback]);
  return buttonToReturn;
};

const PrevButton = ({
  prev,
  enabled,
  callback,
}: {
  prev: (callback: (index: number) => void) => void;
  enabled: true | string;
  callback: (index: number) => void;
}) => {
  // Memoize which button to return (based on whether we are enabled or not)
  const buttonToReturn = useMemo(() => {
    if (enabled === true)
      return (
        <RegulerButton
          style={{
            width: "50%",
            justifyContent: "center",
            gap: "0px",
          }}
          className="pt-[calc(1rem+1px)] pb-[calc(1rem+1px)] gap-0"
          onClick={() => prev(callback)}
        >
          <WrappedImage
            src={{
              dark: "/icons/dropdown-arrow-light.svg",
              light: "/icons/dropdown-arrow-dark.svg",
            }}
            width={26}
            height={26}
            className="rotate-[90deg]"
          ></WrappedImage>
          Prev Step
        </RegulerButton>
      );

    return (
      <div className="w-[50%] pointer-events-none">
        <RegulerButton
          style={{
            width: "100%",
            justifyContent: "center",
            gap: "0px",
          }}
          className="pt-[calc(1rem+1px)] pb-[calc(1rem+1px)] gap-0 opacity-40"
        >
          <WrappedImage
            src={{
              dark: "/icons/dropdown-arrow-light.svg",
              light: "/icons/dropdown-arrow-dark.svg",
            }}
            width={26}
            height={26}
            className="rotate-[90deg]"
          ></WrappedImage>
          Prev Step
        </RegulerButton>
      </div>
    );
  }, [enabled, prev, callback]);
  return buttonToReturn;
};
