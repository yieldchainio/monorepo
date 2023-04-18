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
import { TokenSwap } from "../components/token-swap";

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
        <TokenSwap
          network={network}
          tokens={availableTokens}
          fromToken={fromToken}
          setFromToken={chooseFromToken}
          toToken={toToken}
          setToToken={chooseToToken}
        />
      </BaseActionConfig>
    );
  }
);