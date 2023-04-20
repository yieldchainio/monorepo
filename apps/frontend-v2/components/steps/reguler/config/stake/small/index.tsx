/**
 * A Small Stake Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { ProtocolsDropdown } from "../../components/protocol-dropdown";

export const SmallStakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-8 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="246px"
        height="230.5px"
        step={step}
        triggerComparison={triggerComparison}
      >
        <div className="w-full z-[100000000000]">
          <ProtocolsDropdown setChoice={() => null} />
        </div>
      </BaseActionConfig>
    );
  }
);
