/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { BaseNode } from "components/steps/components/node";
import { BaseActionConfig } from "../../base";
import { ProtocolsDropdown } from "../../components/protocol-dropdown";
import { YCProtocol } from "@yc/yc-models";
import WrappedText from "components/wrappers/text";
import { ChooseToken } from "../../components/choose-token";
import { useAddLiquidity } from "../hooks/useAddLiquidity";
import WrappedImage from "components/wrappers/image";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { cancelAction } from "components/steps/utils/cancel-action";
import { useLogs } from "utilities/hooks/stores/logger";
import { WarningMessage } from "components/logger/components/warning";
import { useAssertTokensAmount } from "../hooks/useAssertTokensAmount";
import { completeLPConfig } from "../utils/complete-lp-config";

export const MediumAddLiquidityConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
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
    } = useAddLiquidity({ step, triggerComparison });

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
        handleComplete={() => completeLPConfig(step, context)}
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
          <WrappedText className="ml-0.5">Protocol</WrappedText>
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
  }
);
