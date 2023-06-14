/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseActionConfig } from "../../../../base";
import { ProtocolsDropdown } from "components/steps/reguler/config/components/protocol-dropdown";
import WrappedText from "components/wrappers/text";
import { ChooseToken } from "components/steps/reguler/config/components/choose-token";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useAssertTokensAmount } from "../../../hooks/useAssertTokensAmount";
import { completePerpBasketLPConfig } from "../utils/complete-perp-basket-lp-config";
import { TokenSwap } from "components/steps/reguler/config/swap/components/token-swap";
import { useAddPerpBasketLiquidity } from "../hooks/useAddPerpBasketLiquidity";
import { YCToken } from "@yc/yc-models";
import { RepresentedTokensLpBasket } from "components/steps/reguler/config/add-liquidity/configs/perp-basket/components/represented-basket";

/* eslint-disable react/display-name */
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
    network,
    availableTokens,
    representationToken,
    basketDepositToken,
    chooseBasketDepositToken,
    allBasketTokens,
  } = useAddPerpBasketLiquidity({
    step,
    triggerComparison,
  });

  /**
   * We assert that we must have 1 available outflows from our parent at all times.
   */
  // useAssertTokensAmount({
  //   step,
  //   triggerComparison,
  //   tokens: availableTokens,
  //   amount: 1,
  // });

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
      height="498px"
      step={step}
      triggerComparison={triggerComparison}
      handleComplete={() => completePerpBasketLPConfig(step, context)}
      canContinue={
        protocol
          ? basketDepositToken
            ? representationToken
              ? true
              : "Invalid Representation Token"
            : "Please Choose Basket Deposit Token"
          : "Please Choose A Protocol"
      }
    >
      <WrappedText className=" w-full whitespace-pre-wrap text-opacity-40 mt-[-1.5rem]">
        {"Mint an LP basket token, representing liquidity used to trade futures on " +
          (protocol?.name || "")}
      </WrappedText>
      <div className="w-full flex flex-col gap-1">
        <WrappedText className="ml-0.5">Protocol</WrappedText>
        <ProtocolsDropdown
          setChoice={chooseProtocol}
          choice={protocol}
          protocols={protocols}
        />
      </div>
      <div className="w-[80%]">
        <TokenSwap
          network={network}
          fromToken={basketDepositToken}
          toToken={representationToken}
          setFromToken={chooseBasketDepositToken}
          setToToken={(token: YCToken) => null}
          tokens={{
            from: availableTokens,
            to: representationToken ? [representationToken] : [],
          }}
        />
      </div>
      <RepresentedTokensLpBasket
        tokens={allBasketTokens}
        imageProps={{
          width: 28,
          height: 28,
        }}
        margin={8}
      />
    </BaseActionConfig>
  );
});
