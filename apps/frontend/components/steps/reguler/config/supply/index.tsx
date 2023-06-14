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
import { getProtocolSupplyConfig } from "./utils/get-protocol-supply-config";

/* eslint-disable react/display-name */
export const SupplyConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    const [SupplyComponent, setSupplyComponent] = useState<
      ForwardRefExoticComponent<StepProps & RefAttributes<HTMLDivElement>>
    >(getProtocolSupplyConfig(step));

    useEffect(() => {
      setSupplyComponent(getProtocolSupplyConfig(step));
    }, [step.protocol?.id]);

    return (
      <SupplyComponent
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
