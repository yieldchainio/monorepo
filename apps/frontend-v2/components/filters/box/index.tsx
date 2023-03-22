import { RegulerButton } from "components/buttons/reguler";
import WrappedText from "components/wrappers/text";
import { forwardRef, MouseEvent } from "react";
import { FilterBoxProps } from "../types";

/**
 * A Component for the filter box,
 * displays how many filters are applied,
 * opens a prop-provided modal, dropdown, etc
 */

export const FilterBox = forwardRef<HTMLDivElement, FilterBoxProps>(
  ({ filters, onClick, className }: FilterBoxProps, ref) => {
    return (
      <RegulerButton
        className={
          "w-[141px] bg-custom-bg hover:bg-custom-subbg will-change-transform min-w-max" +
          " " +
          (className || "")
        }
        onClick={(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>
          onClick && onClick(e)
        }
        ref={ref}
      >
        <WrappedText
          fontSize={14}
          fontStyle={"reguler"}
          className="w-full smallLaptop:hidden"
        >
          Filters
        </WrappedText>
        <div className=" bg-gradient-to-r from-[#00B2EC] to-[#D9CA0F] w-full h-[20px] rounded-full flex flex-row items-center justify-center min-w-[22px] max-w-[22px]">
          <WrappedText fontSize={12} fontStyle={"reguler"}>
            {filters.toString()}
          </WrappedText>
        </div>
      </RegulerButton>
    );
  }
);
