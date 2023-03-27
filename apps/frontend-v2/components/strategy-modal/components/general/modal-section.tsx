/**
 * A section within the modal.
 *
 * Pretty much a slightly rounded, gray section that flexes itself and accepts
 * an arbitrary height parameters.
 */

import { BaseComponentProps } from "components/types";

export const InterModalSection = ({
  height,
  width = `w-full`,
  className,
}: {
  height: `h-${string}`;
  width?: `w-${string}`;
} & BaseComponentProps) => {
  return (
    <div
      className={
        "bg-custom-componentbg rounded-xl " +
        " " +
        height +
        " " +
        width +
        " " +
        (className || "")
      }
    ></div>
  );
};
