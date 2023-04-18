/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseNode } from "components/steps/components/node";

export const SmallAddLiquidityConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    // Return the JSX
    return (
      <BaseNode
        className="flex-col px-4 py-2.5 gap-3"
        style={style}
        ref={ref}
        {...props}
        width="246px"
        height="112.5px"
        step={step}
        triggerComparison={triggerComparison}
      ></BaseNode>
    );
  }
);
