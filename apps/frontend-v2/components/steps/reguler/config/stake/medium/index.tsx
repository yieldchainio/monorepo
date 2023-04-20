/**
 * A Small Stake Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { ProtocolsDropdown } from "../../components/protocol-dropdown";

export const MediumStakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
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
      >
        <div className="w-full">
          <ProtocolsDropdown setChoice={() => null} />
        </div>
      </BaseActionConfig>
    );
  }
);
