/**
 * Card for an upgrade tier
 */

import GradientButton from "components/buttons/gradient";
import { GradientBorder } from "components/gradient-border";
import { BaseComponentProps } from "components/types";
import WrappedText from "components/wrappers/text";

export const Tier = ({
  tierName,
  price,
  description,
  onClick,
  style,
  className,
  borderColors,
}: {
  tierName: string;
  price: number;
  description: string;
  onClick: () => any;
  borderColors?: {
    heavyColor: string;
    lightColor: string;
  };
} & BaseComponentProps) => {
  return (
    <div
      className={
        "h-[300px] w-[40%] bg-custom-darkSubbg " + " " + (className || "")
      }
      style={{ minWidth: "150px", borderRadius: "1rem" }}
    >
      <GradientBorder
        borderRadius="1rem"
        {...borderColors}
        borderWidth="2px"
        width="100%"
        height="300px"
        // className="opacity-50 "
        globalClassname={"  cursor-pointer transition duration-200 ease-in-out"}
        heavyColor={borderColors?.heavyColor}
        lightColor={borderColors?.lightColor}
        style={{
          minWidth: "150px",
          ...style
        }}
      >
        <div className="w-full h-max flex flex-col items-center justify-start py-14 gap-14 ">
          <div className="flex flex-col gap-2 items-center justify-center  w-[50%] mobile:w-[60%]  ">
            <WrappedText
              fontSize={42}
              fontStyle="black"
              className="tablet:whitespace-pre-wrap text-center mobile:text-[32px]  "
            >
              {`$${price}`}
            </WrappedText>
            <WrappedText
              className="text-opacity-30  text-center mobile:text-[15px]"
              fontSize={16}
            >
              {description}
            </WrappedText>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center mt-auto ">
            <div className="flex flex-row gap-1.5 ">
              <GradientButton>Buy Now</GradientButton>
            </div>
          </div>
        </div>
      </GradientBorder>
    </div>
  );
};
