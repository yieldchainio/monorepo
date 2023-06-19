/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseNode } from "components/steps/components/node";
import { BaseActionConfig } from "../../base";
import { useSwap } from "../hooks/useSwap";
import { TokenSwap } from "../components/token-swap";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { completeSwapConfig } from "../utils/complete-swap-config";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const SmallSwapConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
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
    } = useSwap();

    /**
     * Get a portal to the canvas (For tooltips)
     */
    const canvasPortal = useCanvasPortal();

    /**
     * Get the global context
     */
    const context = useYCStore((state) => state.context);

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-4 py-2.5 gap-6"
        ref={ref}
        {...props}
        width="246px"
        height="235px"
        handleComplete={() => completeSwapConfig(step, context)}
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
          portal={canvasPortal}
          tokens={availableTokens}
          fromToken={fromToken}
          setFromToken={chooseFromToken}
          toToken={toToken}
          setToToken={chooseToToken}
          dropdownProps={{
            imageProps: {
              width: 20,
              height: 20,
            },
            textProps: {
              fontSize: 12,
              className: "leading-none",
            },
            buttonProps: {
              style: {
                width: "100%",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            },
          }}
          bottomDropdownProps={{
            buttonProps: {
              className: "-mt-3",
              style: {
                width: "100%",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            },
          }}
        />
      </BaseActionConfig>
    );
  }
);
