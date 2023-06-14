/**
 * A section within the modal.
 *
 * Pretty much a slightly rounded, gray section that flexes itself and accepts
 * an arbitrary height parameters.
 */

import { BaseComponentProps } from "components/types";

("justify-start");
("items-start");
("justify-end");
("items-end");

export const InterModalSection = ({
  height,
  width = `w-full`,
  className,
  children,
  paddingX = `px-10`,
}: {
  height: `h-${string}`;
  width?: `w-${string}`;
  children?: React.ReactNode;
  paddingX?: `px-${string}`;
} & BaseComponentProps) => {
  return (
    <div
      className={
        "bg-custom-componentbg rounded-xl flex flex-row " +
        " " +
        paddingX +
        " " +
        height +
        " " +
        width +
        " " +
        (className || "")
      }
    >
      {children}
    </div>
  );
};
