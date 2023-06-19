/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseNode } from "components/steps/components/node";
import { BaseActionConfig } from "../../../../base";
import { useAddLiquidity } from "../../../hooks/useAddLiquidity";
import { useAssertTokensAmount } from "../../../hooks/useAssertTokensAmount";
import { ChooseToken } from "../../../../components/choose-token";
import WrappedText from "components/wrappers/text";
import { ProtocolsDropdown } from "../../../../components/protocol-dropdown";
import { completeStandardSupply } from "../utils/complete-standard-supply-config";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { ProtocolType } from "@prisma/client";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const SmallStandardAddLiquidityConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

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
    } = useAddLiquidity({});

    /**
     * We asser that we must have 2 available outflows from our parent at all times. Otherwise,
     * it is an invalid attempt of adding an LP config and we hence cancel the action
     */
    useAssertTokensAmount({
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
        ref={ref}
        {...props}
        width="246px"
        height="230.5px"
        handleComplete={() => completeStandardSupply(step, context)}
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
  }
);
