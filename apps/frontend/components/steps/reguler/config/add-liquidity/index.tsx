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
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const AddLiquidityConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

    const [AddLiqComponent, setAddLiquidityComponent] = useState<
      ForwardRefExoticComponent<StepProps & RefAttributes<HTMLDivElement>>
    >(getProtocolLpConfig(step));

    useEffect(() => {
      setAddLiquidityComponent(getProtocolLpConfig(step));
    }, [step.protocol?.id]);

    return <AddLiqComponent ref={ref} {...props} />;
  }
);
