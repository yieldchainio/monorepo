/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseActionConfig } from "../../../../base";
import { useAddLiquidity } from "../../../hooks/useAddLiquidity";
import { useAssertTokensAmount } from "../../../hooks/useAssertTokensAmount";
import { ChooseToken } from "../../../../components/choose-token";
import WrappedText from "components/wrappers/text";
import { ProtocolsDropdown } from "../../../../components/protocol-dropdown";
import { completePerpBasketLPConfig } from "../utils/complete-perp-basket-lp-config";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const SmallPerpBasketAddLiquidityConfig = forwardRef<
  HTMLDivElement,
  StepProps
>(({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
  /**
   * Get the add liquidity variables & methods
   */
  const {
    protocol,
    protocols,
    chooseProtocol,
    chooseTokenA,
    chooseTokenB,
    tokenA,
    tokenB,
    network,
    availableTokens,
  } = useAddLiquidity({
    step,
    triggerComparison,
  });

  /**
   * We asser that we must have 2 available outflows from our parent at all times. Otherwise,
   * it is an invalid attempt of adding an LP config and we hence cancel the action
   */
  useAssertTokensAmount({
    step,
    triggerComparison,
    tokens: availableTokens,
  });

  /**
   * Get global context
   */
  const context = useYCStore((state) => state.context);

  // Return the JSX
  return (
    <BaseActionConfig
      className="flex-col px-4 py-2.5 gap-3"
      style={style}
      ref={ref}
      {...props}
      width="246px"
      height="230.5px"
      step={step}
      triggerComparison={triggerComparison}
      canvasID={canvasID}
      handleComplete={() => completePerpBasketLPConfig(step, context)}
      canContinue={
        protocol
          ? tokenA
            ? tokenB
              ? true
              : "Please Choose Token B"
            : "Please Choose Token A"
          : "Please Choose A Protocol"
      }
    >
      <div className="w-full flex flex-col gap-1">
        <ProtocolsDropdown
          setChoice={chooseProtocol}
          choice={protocol}
          protocols={protocols}
        />
      </div>
      <div className="flex flex-row w-full gap-1 items-center justify-center">
        <ChooseToken
          tokens={availableTokens}
          network={network}
          setChoice={chooseTokenA}
          choice={tokenA}
          label="Token A"
          style={{
            width: "100%",
          }}
          dropdownProps={{
            disabled: !protocol ? "Please Choose A Protocol " : false,
            textProps: {
              style: {
                visibility: "hidden",
              },
            },
            buttonProps: {
              style: {
                alignItems: "center",
                justifyContent: "center",
                gap: "0px",
                padding: "0.5rem",
              },
            },
          }}
        />
        <div className="w-[25px] h-[25px] border-[1px] border-custom-themedBorder rounded-full  z-10 bg-custom-bcomponentbg flex items-center justify-center">
          <WrappedText>+</WrappedText>
        </div>
        <ChooseToken
          tokens={availableTokens}
          network={network}
          setChoice={chooseTokenB}
          choice={tokenB}
          label="Token B"
          style={{
            width: "100%",
          }}
          dropdownProps={{
            disabled: !protocol ? "Please Choose A Protocol " : false,
            textProps: {
              style: {
                visibility: "hidden",
              },
            },
            buttonProps: {
              style: {
                alignItems: "center",
                justifyContent: "center",
                gap: "0px",
                padding: "0.5rem",
              },
            },
          }}
        />
      </div>
    </BaseActionConfig>
  );
});
