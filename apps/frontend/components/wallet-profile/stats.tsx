"use client";
import { YCTier } from "@yc/yc-models/src/core/tier";
import { RegulerButton } from "components/buttons/reguler";
import { UpgradeTierModal } from "components/modals/upgrade";
import Section from "components/section";
import WrappedText from "components/wrappers/text";
import { useModals } from "utilities/hooks/stores/modal";

interface ProfileStatsProps {
  createdVaults: number;
  tier: YCTier;
}

/**
 * Subsection for the stats of the profile modal
 */
function ProfileStats({ createdVaults, tier }: ProfileStatsProps) {
  const modals = useModals();
  return (
    <div className="">
      <Section
        title="Stats"
        titleLink="/portfolio"
        fields={{
          Vaults: 5,
          Deposits: "$5,112.14",
          "Create Vaults": createdVaults,
          Royalties: "$1,112.55",
          Tier: tier.name,
        }}
        key="SectionComponent"
        sectionsClassname="gap-4"
      >
        <RegulerButton
          onClick={() => modals.lazyPush(<UpgradeTierModal />)}
          className="mt-3"
          key="SectionComponent"
        >
          <WrappedText>Upgrade Tier 💎</WrappedText>
        </RegulerButton>
      </Section>
      <div className="w-full"></div>
    </div>
  );
}

export default ProfileStats;
