/**
 * Modal to upgrade one's tier to premium
 */

import { BaseModalChildProps } from "components/types";

import { DetailsSection } from "./components/DetailsSection";
import { TiersSection } from "./components/TiersSection";
import { YCTier } from "@yc/yc-models/src/core/tier";
import { useEffect, useState } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const UpgradeTierModal = ({
  modalKey,
  onClick,
  style,
  className,
}: BaseModalChildProps) => {
  const tiers = useYCStore((state) => state.context.tiers);

  const [chosenTier, setChosenTier] = useState<YCTier>(tiers[0]);

  return (
    <div
      className={
        "flex flex-row py-16 px-16 bg-custom-bcomponentbg rounded-lg w-[90vw] tablet:flex-col tablet:gap-6 h-[70%]  mt-auto mb-auto" +
        " " +
        (className || "")
      }
      onClick={onClick}
      style={style}
    >
      <DetailsSection
        chosenTier={chosenTier}
        setChosenTier={setChosenTier}
        tiers={tiers}
      />
      <TiersSection chosenTier={chosenTier} />
    </div>
  );
};
