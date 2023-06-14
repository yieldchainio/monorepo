/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { getProtocolLpConfig } from "./utils/get-protocol-lp-config";

/* eslint-disable react/display-name */
export const AddLiquidityConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    const [AddLiqComponent, setAddLiquidityComponent] = useState<
      ForwardRefExoticComponent<StepProps & RefAttributes<HTMLDivElement>>
    >(getProtocolLpConfig(step));

    useEffect(() => {
      setAddLiquidityComponent(getProtocolLpConfig(step));
    }, [step.protocol?.id]);

    return (
      <AddLiqComponent
        step={step}
        style={style}
        triggerComparison={triggerComparison}
        ref={ref}
        {...props}
        canvasID={canvasID}
      />
    );
  }
);
