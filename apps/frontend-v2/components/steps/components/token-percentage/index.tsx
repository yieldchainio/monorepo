/**
 * A component for the token percentage box
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { TokensBundle } from "components/tokens/bundle";
import WrappedText from "components/wrappers/text";
import { InfoProvider } from "components/info-providers";
import WrappedImage from "components/wrappers/image";
import { TokenPercentageModal } from "./modal";

export const TokenPercentageBox = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    return (
      <div
        className=" absolute w-[80px] h-[30px] bg-custom-componentbg dark:bg-custom-bg rounded-md border-[1px] border-custom-border dark:border-custom-themedBorder flex flex-row items-center justify-center px-2 gap-2"
        style={style}
      >
        <div className="flex flex-row items-center justify-start">
          <WrappedText fontStyle="black" className="dark:text-opacity-75">
            %
          </WrappedText>
          <TokensBundle
            tokens={step.outflows}
            imageProps={{
              className:
                "border-[1px] border-custom-componentbg dark:border-custom-bg bg-custom-componentbg dark:bg-custom-bg",
              width: 20,
              height: 20,
            }}
            margin={10}
            tooltipEnabled={false}
          />
        </div>

        {step.writeable && step.outflows.length ? (
          <InfoProvider
            trigger="onClick"
            contents={
              <TokenPercentageModal
                step={step}
                triggerComparison={triggerComparison}
              />
            }
          >
            <div>
              <InfoProvider contents="Edit Inflows %" delay={500}>
                <div className="">
                  <WrappedImage
                    src={{
                      dark: "/icons/edit-light.svg",
                      light: "/icons/edit-dark.svg",
                    }}
                    width={14}
                    height={14}
                    className="opacity-75 hover:opacity-50 transition duration-200 cursor-pointer"
                  />
                </div>
              </InfoProvider>
            </div>
          </InfoProvider>
        ) : null}
      </div>
    );
  }
);
