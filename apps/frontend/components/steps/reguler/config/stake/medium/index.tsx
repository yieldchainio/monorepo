/**
 * A Small Stake Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { ProtocolsDropdown } from "../../components/protocol-dropdown";
import { useProtocols } from "../../hooks/useProtocols";
import { useStake } from "../hooks/useStake";
import { getRewardsFunction } from "../utils/getRewardsFunction";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import WrappedText from "components/wrappers/text";
import { PoolsDropdown } from "../components/pool-dropdown";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const MediumStakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ ...props }: StepProps, ref) => {
    const { step } = useStepContext();
    /**
     * Get all of our stake-related variables, methods from the useStake hook
     */
    const {
      chooseProtocol,
      protocols,
      protocol,
      chooseFunction,
      functions,
      stakeFunction,
    } = useStake();

    useEffect(() => {
      step.setFunction(stakeFunction);
    }, [stakeFunction]);

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-8 items-start"
        ref={ref}
        {...props}
        width="327px"
        height="348px"
        handleComplete={() => {
          // We set the step's function to our stake function on completion
          step.setFunction(stakeFunction);
        }}
      >
        <div className="w-full flex flex-col gap-1">
          <WrappedText>Protocol</WrappedText>
          <ProtocolsDropdown
            setChoice={chooseProtocol}
            protocols={protocols}
            choice={protocol}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <WrappedText>Staking Pool</WrappedText>
          <PoolsDropdown
            size={step.size}
            setChoice={chooseFunction}
            functions={functions}
            choice={stakeFunction}
          />
        </div>
      </BaseActionConfig>
    );
  }
);
