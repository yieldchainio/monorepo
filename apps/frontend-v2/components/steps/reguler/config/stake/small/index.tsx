/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";

export const SmallStakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    return <div></div>
  }
);
