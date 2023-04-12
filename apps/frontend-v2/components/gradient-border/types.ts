/**
 * Types for the gradient border component
 */

import { BaseComponentProps } from "components/types";
import { CSSProperties } from "react";

/**
 * @param gradientDegree - the rotation degree of the gradient
 * @param heavyColor - the color of the heavier colored part
 * @param lightColor - the color of the lighter colored part
 * @param borderRadius - The radius of the border
 * @param children - inherited, children for it. Can be used to fill it up with some background
 */
export interface GradientBorderProps extends BaseComponentProps {
  gradientDegree?: `${number}deg`;
  heavyColor?: string;
  lightColor?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  childrenContainerStyle?: CSSProperties;
  borderWidth?: string;
  globalClassname?: string;
}
