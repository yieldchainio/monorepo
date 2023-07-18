/**
 * Modal to upgrade one's tier to premium
 */

import { BaseModalChildProps } from "components/types";

import { DetailsSection } from "./components/DetailsSection";
import { TiersSection } from "./components/TiersSection";

export const UpgradeTierModal = ({
  modalKey,
  onClick,
  style,
  className,
}: BaseModalChildProps) => {
  return (
    <div
      className={
        "flex flex-row py-16 px-16 bg-custom-bcomponentbg rounded-lg w-[90vw] tablet:flex-col tablet:gap-6 h-max " +
        " " +
        (className || "")
      }
      onClick={onClick}
      style={style}
    >
      <DetailsSection />
      <TiersSection />
    </div>
  );
};
