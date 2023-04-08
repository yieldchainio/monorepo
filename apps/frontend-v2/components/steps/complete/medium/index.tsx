/**
 * Medium component of completed step
 */

import { forwardRef } from "react";
import { CompleteStepProps, CompleteStepSizedProps } from "../types";

export const MediumCompleteStep = forwardRef<
  HTMLDivElement,
  CompleteStepSizedProps
>(({ step, style, ...props }: CompleteStepSizedProps, ref) => {
  return <div className="" {...props}></div>;
});
