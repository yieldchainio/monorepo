"use client";
import { RegulerButton } from "components/buttons/reguler";
import Section from "components/section";

interface ProfileStatsProps {
  createdVaults: number;
}

/**
 * Subsection for the stats of the profile modal
 */
function ProfileStats({ createdVaults }: ProfileStatsProps) {
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
        }}
        key="SectionComponent"
        sectionsClassname="gap-4"
      ></Section>
    </div>
  );
}

export default ProfileStats;
