/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { BaseActionConfig } from "../../../../base";
import { ProtocolsDropdown } from "../../../../components/protocol-dropdown";
import WrappedText from "components/wrappers/text";
import { ChooseToken } from "../../../../components/choose-token";
import { useAddLiquidity } from "../../../hooks/useAddLiquidity";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useAssertTokensAmount } from "../../../hooks/useAssertTokensAmount";
import { completePerpBasketLPConfig } from "../utils/complete-perp-basket-lp-config";

export const MediumPerpBasketAddLiquidityConfig = forwardRef<
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
      className="flex-col px-0 py-2.5 gap-8 items-start"
      style={style}
      ref={ref}
      {...props}
      canvasID={canvasID}
      width="327px"
      height="328px"
      step={step}
      triggerComparison={triggerComparison}
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
      <WrappedText>This Is Perp Basket</WrappedText>
      <div className="w-full flex flex-col gap-1">
        <WrappedText className="ml-0.5">Protocol</WrappedText>
        <ProtocolsDropdown
          setChoice={chooseProtocol}
          choice={protocol}
          protocols={protocols}
        />
      </div>
      <div className="flex flex-col w-full gap-1 items-center justify-center">
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
          }}
        />
      </div>
    </BaseActionConfig>
  );
});
