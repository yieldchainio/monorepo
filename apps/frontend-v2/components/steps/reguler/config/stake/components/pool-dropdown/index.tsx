/**
 * Component for staking pools dropdown, opens up a modal
 */

import { YCFunc, YCProtocol, YCToken } from "@yc/yc-models";
import Dropdown from "components/dropdown";
import { DropdownOption, DropdownProps } from "components/dropdown/types";
import { StepProps } from "components/steps/types";
import { forwardRef, useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { getRewardsFunction } from "../../utils/getRewardsFunction";
import { Pool, PoolsDropdownProps } from "./types";
import WrappedImage from "components/wrappers/image";
import { TokensBundle } from "components/tokens/bundle";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { GradientBorder } from "components/gradient-border";
import WrappedText from "components/wrappers/text";
import { StepSizing } from "utilities/classes/step/types";
export const PoolsDropdown = forwardRef(
  (
    {
      choice,
      setChoice,
      dropdownProps,
      portal,
      style,
      functions,
      className,
      size,
    }: PoolsDropdownProps,
    ref
  ) => {
    /**
     * Get global context
     */
    const context = useYCStore((state) => state.context);

    /**
     * Memoize our protocols to use
     */
    const pools: DropdownOption<Pool>[] = useMemo(
      () =>
        functions.flatMap((func) => {
          // Get the function that is considered the main rewards/harvesting function for the stake function
          const rewardsFunction = getRewardsFunction(func, context);

          // It must be defined
          if (!rewardsFunction) return [];

          return [
            {
              text: "",
              image: undefined,
              data: {
                stake: func,
                rewards: rewardsFunction,
              },
            },
          ];
        }),
      [functions, functions.length]
    );

    /**
     * Memoize choice to display
     */
    const memoChoice = useMemo(() => {
      if (choice) {
        const rewardsFunction = getRewardsFunction(choice, context);
        return {
          text: `${choice.outflows.map((token, i) =>
            i == 0 ? token.symbol : `, ${token.symbol}`
          )}`,
          image: (
            <div className="flex flex-row items-center">
              <TokensBundle
                tokens={choice.outflows}
                imageProps={{
                  width: 24,
                  height: 24,
                }}
              />
              <TokensBundle
                showAdditionalText={false}
                tokens={rewardsFunction.inflows}
                imageProps={{
                  width: 18,
                  height: 18,
                  className: "border-[1px] border-custom-bcomponentbg",
                }}
                style={{
                  marginLeft: "-6px",
                  transform: "translate(-20%, 50%)",
                }}
                maxImages={1}
                textProps={{
                  style: {
                    transform: "translate(-30%, 60%)",
                  },
                  fontSize: 10,
                }}
              />
            </div>
          ),
          data: {
            stake: choice,
            rewards: rewardsFunction,
          },
        };
      }

      return {
        text: undefined,
        image: undefined,
        data: undefined,
      };
    }, [choice, choice?.id]);

    return (
      <InfoProvider
        contents={"Choose A Staking Pool"}
        direction={ToolTipDirection.LEFT}
        portal={portal}
      >
        <Dropdown
          type="searchable"
          options={pools}
          buttonProps={{
            style: {
              width: "100%",
              gap: "0px",
              ...style,
            },
            className,
          }}
          choice={memoChoice}
          menuProps={{
            style: {
              height: "250px",
              zIndex: 1000,
              overflowY: "scroll",
            },
            className: "overflow-y-scroll scrollbar-hide",
            optionText: (_option: DropdownOption<Pool>) => {
              return (
                <div className="flex flex-row items-center justify-between gap-3 w-full">
                  <div className="flex flex-row items-center justify-start gap-1">
                    <WrappedText className="leading-0">Stake</WrappedText>
                    <TokensBundle
                      tokens={_option.data.stake.outflows}
                      showTextIfSingle
                    />
                  </div>
                  <WrappedImage
                    src={{
                      dark: "/icons/arrow-light.svg",
                      light: "/icons/arrow-dark.svg",
                    }}
                    className="rotate-[-90deg] opacity-50"
                    width={14}
                    height={14}
                  />
                  <div className="flex flex-row items-center justify-start gap-1">
                    <WrappedText className="text-transparent bg-clip-text bg-gradient-to-r from-custom-yclb to-custom-ycy">
                      {size == StepSizing.MEDIUM ? "Earn" : "+"}
                    </WrappedText>
                    <TokensBundle
                      tokens={_option.data.rewards.inflows}
                      imageProps={{
                        className: "border-[1px] border-custom-bcomponentbg",
                        width: 24,
                        height: 24,
                      }}
                    />
                  </div>
                </div>
              );
            },
          }}
          autoChoice={false}
          choiceHandler={(choice: DropdownOption<Pool>) =>
            setChoice(choice.data.stake)
          }
          {...dropdownProps}
        ></Dropdown>
      </InfoProvider>
    );
  }
);

const EarnTokensChip = ({
  tokens,
  size,
}: {
  tokens: YCToken[];
  size: StepSizing;
}) => {
  return (
    <GradientBorder
      childrenContainerClassname="bg-custom-bcomponentbg flex p-3 flex-row items-center justify-between cursor-pointer shadow-md"
      width="100px"
      height="30px"
      borderRadius="0.75rem"
      borderWidth="0.12rem"
      heavyColor="rgba(0, 178, 236, 1)"
      lightColor="rgba(217, 202, 15, 1)"
      globalClassname="absolute left-[75%] top-[-30%] "
    >
      <WrappedText className="text-transparent bg-clip-text bg-gradient-to-r from-custom-yclb to-custom-ycy">
        {size == StepSizing.MEDIUM ? "Earn" : "+"}
      </WrappedText>
      <TokensBundle
        tokens={tokens}
        imageProps={{
          width: 20,
          height: 20,
        }}
        showTextIfSingle
        tooltipEnabled
      />
    </GradientBorder>
  );
};
