/**
 * A blurry backdrop color component
 */

import { BaseComponentProps } from "components/types";

interface BackdropColorProps extends BaseComponentProps {
  color: string;
}
export const BackdropColor = ({ color }: BackdropColorProps) => {
  return (
    <div
      className={
        "absolute w-[100vw] h-[50vh] blur-[200px] top-[12vh] left-[100%] dark:bg-[#FFF576] z-0"
      }
      style={{
        backgroundColor: color,
      }}
    ></div>
  );
};
