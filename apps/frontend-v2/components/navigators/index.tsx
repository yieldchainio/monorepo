/**
 * A component for the next & prev buttons for the strategy config
 * (Navigators)
 */

import { NavigatorsProps } from "./types";
import WrappedImage from "components/wrappers/image";
import { RegulerButton } from "components/buttons/reguler";
import GradientButton from "components/buttons/gradient";

export const Navigators = ({ next, prev }: NavigatorsProps) => {
  return (
    <div className="absolute top-[85%] w-[40%] flex flex-row gap-10 z-10 ">
      <PrevButton prev={prev} />
      <NextButton next={next} />
    </div>
  );
};

const NextButton = ({ next }: { next: () => void }) => {
  return (
    <GradientButton
      style={{
        width: "50%",
      }}
      className="py-4"
      onClick={next}
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
};

const PrevButton = ({ prev }: { prev: () => void }) => {
  return (
    <RegulerButton
      style={{
        width: "50%",
        justifyContent: "center",
        gap: "0px",
      }}
      className="pt-[calc(1rem+1px)] pb-[calc(1rem+1px)] gap-0"
      onClick={prev}
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
};
