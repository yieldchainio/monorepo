/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseNode } from "components/steps/components/node";
import { BaseActionConfig } from "../../base";

export const SmallSwapConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-4 py-2.5 gap-3"
        style={style}
        ref={ref}
        {...props}
        width={"246px"}
        height={"56px"}
        step={step}
        triggerComparison={triggerComparison}
      ></BaseActionConfig>
    );
  }
);
