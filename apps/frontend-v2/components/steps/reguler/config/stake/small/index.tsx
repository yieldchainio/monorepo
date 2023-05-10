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

export const SmallStakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
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
    } = useStake({ step, triggerComparison });
    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-4 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="246px"
        height="245.5px"
        step={step}
        triggerComparison={triggerComparison}
        handleComplete={() => {
          // We set the step's function to our stake function on completion
          step.setFunction(stakeFunction)
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
