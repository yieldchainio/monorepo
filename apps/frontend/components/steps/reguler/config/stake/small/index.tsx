/**
 * A Small Stake Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { ProtocolsDropdown } from "../../components/protocol-dropdown";
import { useStake } from "../hooks/useStake";
import { PoolsDropdown } from "../components/pool-dropdown";
import WrappedText from "components/wrappers/text";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const SmallStakeConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

    /**
     * Get all of our stake-related variables, methods from the useStake hook
     */
    const {
      chooseProtocol,
      protocols,
      protocol,
      network,
      chooseFunction,
      functions,
      stakeFunction,
      rewardsFunction,
    } = useStake();

    useEffect(() => {
      step.setFunction(stakeFunction);
    }, [stakeFunction]);

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-4 items-start"
        ref={ref}
        {...props}
        width="246px"
        height="245.5px"
        handleComplete={() => {
          // We set the step's function to our stake function on completion
          step.setFunction(stakeFunction);
        }}
      >
        <div className="w-full">
          <ProtocolsDropdown
            setChoice={chooseProtocol}
            protocols={protocols}
            choice={protocol}
          />
        </div>
        <div className="w-full">
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
