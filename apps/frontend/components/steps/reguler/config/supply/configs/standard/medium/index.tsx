/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { BaseActionConfig } from "../../../../base";
import { ProtocolsDropdown } from "../../../../components/protocol-dropdown";
import WrappedText from "components/wrappers/text";
import { ChooseToken } from "../../../../components/choose-token";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useAssertTokensAmount } from "../../../hooks/useAssertTokensAmount";
import { completeStandardSupply } from "../utils/complete-standard-supply-config";
import { RepresentedTokens } from "components/steps/reguler/config/components/represented-basket";
import { useSupply } from "../hooks/useSupply";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const MediumStandardAddLiquidityConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

    /**
     * Get the add liquidity variables & methods
     */
    const {
      protocol,
      protocols,
      chooseProtocol,
      network,
      availableTokens,
      chooseCollateral,
      collateralToken,
      availableMarkets,
      representationToken,
    } = useSupply({});

    /**
     * We asser that we must have 2 available outflows from our parent at all times. Otherwise,
     * it is an invalid attempt of adding an LP config and we hence cancel the action
     */
    // useAssertTokensAmount({
    //   step,
    //   triggerComparison,
    //   tokens: availableTokens,
    //   amount: protocol ? 2 : 1,
    // });

    /**
     * Get global context
     */
    const context = useYCStore((state) => state.context);

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-7 items-start"
        ref={ref}
        {...props}
        width="327px"
        height="468px"
        handleComplete={() => completeStandardSupply(step, context)}
        canContinue={
          !protocol
            ? "Choose A Protocol"
            : !collateralToken
            ? "Choose Collateral"
            : true
        }
      >
        <WrappedText
          fontSize={12}
          className=" w-full whitespace-pre-wrap text-opacity-40 mt-[-1.3rem]"
        >
          {`Supply Collateral To A Lending Market`}
        </WrappedText>
        <div className="w-full flex flex-col gap-1">
          <WrappedText className="ml-0.5">Protocol</WrappedText>
          <ProtocolsDropdown
            setChoice={chooseProtocol}
            choice={protocol}
            protocols={protocols}
          />
        </div>

        <div className="w-[80%] flex flex-col gap-1">
          <WrappedText className="ml-0.5">Collateral</WrappedText>
          <ChooseToken
            tokens={availableTokens}
            network={network}
            setChoice={chooseCollateral}
            choice={collateralToken}
            style={{
              width: "100%",
            }}
            dropdownProps={{
              disabled: !protocol ? "Please Choose A Protocol " : false,
            }}
          />
        </div>

        <div className="w-[75%] flex flex-col gap-4">
          <RepresentedTokens
            tokens={representationToken ? [representationToken] : []}
            label="Receive:"
          />

          <RepresentedTokens tokens={availableMarkets} label="Markets:" />
        </div>
      </BaseActionConfig>
    );
  }
);
