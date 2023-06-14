/**
 * A blurry backdrop color component
 */

import { BaseComponentProps } from "components/types";

interface BackdropColorProps extends BaseComponentProps {
  color: string;
  top?: `top-${string}`;
  left?: `left-${string}`;
  blur?: `blur-${string}`;
}
export const BackdropColor = ({
  color,
  className,
  left = `left-[100%]`,
  top = `top-[12vh]`,
  blur = `blur-[200px]`,
  style,
}: BackdropColorProps) => {
  return (
    <div
      className={
        "absolute w-[100vw] h-[50vh] dark:bg-[#FFF576] z-[-1] transition duration-700 ease-in-out " +
        top +
        " " +
        left +
        " " +
        blur +
        " " +
        className
      }
      style={{
        backgroundColor: color,
        ...(style || {}),
      }}
    ></div>
  );
};
