/**
 * A component for a card to choose the privacy of the strategy config
 */

import { GradientBorder } from "components/gradient-border";
import WrappedText from "components/wrappers/text";
import { useEffect, useMemo } from "react";
import { PrivacyCardProps } from "./types";

export const PrivacyCard = ({
  title,
  subtitle,
  position,
  chosen,
  heavyColor,
  lightColor,
  setOwn,
  emojies,
  reasons,
  blocked = false,
  blockedContent,
}: PrivacyCardProps) => {
  // Memoize some styling stuff depending on props

  // The X Axis translation based on whether this is a left or rightous card
  const xAxisTranslation = useMemo(() => {
    let base =
      (position == "left" ? "translate-x-[-2%]" : "translate-x-[2%]") + " ";

    if (blocked) base += "cursor-not-allowed";
    else
      base +=
        "cursor-pointer hover:translate-y-[-2%] active:translate-y-[-1%] " +
        (position == "left"
          ? "hover:translate-x-[0%] active:translate-x-[-1%]"
          : "hover:translate-x-[0%] active:translate-x-[1%]");
    return base;
  }, [position, blocked]);

  useEffect(() => {
    if (blocked && chosen) setOwn(false);
  }, [blocked]);

  // The border coloring - If chosen, is colorful. Otherwise, is turned off
  const borderColors: { heavyColor: string; lightColor: string } =
    useMemo(() => {
      if (chosen) return { heavyColor, lightColor };
      return {
        heavyColor: "var(--themed-border)",
        lightColor: "var(--themed-border)",
      };
    }, [chosen]);

  return (
    <div
      className="w-full"
      onClick={() => {
        if (!blocked) setOwn(true);
      }}
    >
      <GradientBorder
        borderRadius="1rem"
        {...borderColors}
        borderWidth="2px"
        width="100%"
        height="100vh"
        className="opacity-50 "
        globalClassname={
          "hover:shadow-lg hover:shadow-custom-textColor/35 transition duration-200 ease-in-out" +
          " " +
          xAxisTranslation
        }
      >
        <div className="relative w-full h-full bg-custom-bcomponentbg bg-opacity-50 backdrop-blur-xl flex flex-col items-center justify-start py-20 gap-14">
          {blocked && blockedContent}
          <div className="flex flex-col gap-2 items-center justify-center  w-[50%] mobile:w-[60%]  ">
            <WrappedText
              fontSize={42}
              fontStyle="bold"
              className="tablet:whitespace-pre-wrap text-center "
            >
              {title + " " + emojies}
            </WrappedText>
            <WrappedText
              className="text-opacity-30 w-[110%] whitespace-pre-wrap text-center mobile:text-[15px]"
              fontSize={18}
            >
              {subtitle}
            </WrappedText>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center mobile:hidden">
            <div className="flex flex-row gap-1.5 ">
              <WrappedText fontSize={26} className="text-opacity-50">
                {"Why Choose"}
              </WrappedText>
              <WrappedText
                fontSize={26}
                fontStyle="bold"
                className="underline text-opacity-50"
              >
                {title}
              </WrappedText>
            </div>

            <div className="flex flex-col gap-3 items-start justify-start">
              {reasons.map(({ reason, description }, i) => {
                return (
                  <ReasonItem
                    reason={reason}
                    description={description}
                    key={i}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </GradientBorder>
    </div>
  );
};

/**
 * A component for a list item in the list of reasons
 */

const ReasonItem = ({
  reason,
  description,
}: {
  reason: string;
  description: string;
}) => {
  return (
    <div className="flex flex-row items-start justify-start gap-2 ">
      <div className="w-[10px] h-[10px] bg-custom-textColor/50 rounded-full mt-[5%]"></div>
      <div className="flex flex-col gap-0 items-start justify-start ">
        <WrappedText className="text-opacity-50 leading-0" fontSize={20}>
          {reason}
        </WrappedText>
        <WrappedText className="text-opacity-30 leading-0" fontSize={14}>
          {description}
        </WrappedText>
      </div>
    </div>
  );
};
