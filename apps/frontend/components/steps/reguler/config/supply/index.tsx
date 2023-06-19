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
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const SupplyConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    const [SupplyComponent, setSupplyComponent] = useState<
      ForwardRefExoticComponent<StepProps & RefAttributes<HTMLDivElement>>
    >(getProtocolSupplyConfig(step));

    useEffect(() => {
      setSupplyComponent(getProtocolSupplyConfig(step));
    }, [step.protocol?.id]);

    return <SupplyComponent ref={ref} {...props} />;
  }
);
