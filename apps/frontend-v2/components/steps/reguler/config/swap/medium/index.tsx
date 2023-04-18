/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { BaseNode } from "components/steps/components/node";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { BaseActionConfig } from "../../base";
import Dropdown from "components/dropdown";
import { TokensModal } from "components/tokens-modal";
import WrappedImage from "components/wrappers/image";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { YCToken } from "@yc/yc-models";
import { useSwap } from "../hooks/useSwap";
import { ChooseToken } from "../components/choose-token";

export const MediumSwapConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    /**
     * Get all of the handlers & variables from the useSwap hook
     */
    const {
      chooseFromToken,
      chooseToToken,
      network,
      availableTokens,
      exchanges,
      fromToken,
      toToken,
    } = useSwap({ step, triggerComparison });

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-4 py-2.5 gap-8"
        style={style}
        ref={ref}
        {...props}
        width="327px"
        height="328px"
        step={step}
        triggerComparison={triggerComparison}
        canContinue={
          fromToken
            ? toToken
              ? true
              : "Please Choose A To token"
            : "Please Choose A From Token"
        }
      >
        <div className="flex flex-col gap-1 w-full">
          <ChooseToken
            label="From"
            network={network}
            tokens={availableTokens}
            choice={fromToken}
            setChoice={chooseFromToken}
          />

          <div className="w-[25px] h-[25px] border-[1px] border-custom-border rounded-md mx-auto -mt-3 z-10 bg-custom-bcomponentbg flex items-center justify-center">
            <WrappedImage
              src={{
                dark: "/icons/arrow-light.svg",
                light: "/icons/arrow-dark.svg",
              }}
              className="w-[60%] h-[60%]"
            />
          </div>
          <ChooseToken
            label="To"
            network={network}
            choice={toToken}
            setChoice={chooseToToken}
          />
        </div>
      </BaseActionConfig>
    );
  }
);
