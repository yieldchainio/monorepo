"use client";
import { RegulerButton } from "components/buttons/reguler";
import Section from "components/section";

export interface ProfileStatsProps {
  createdVaults: number;
}

/**
 * Subsection for the stats of the profile modal
 */
const ProfileStats = ({ createdVaults }: ProfileStatsProps) => {
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
      >
        <div className="w-full">
          <Section fields={{ "Awesome Web3 Protection": "OFF" }}>
            <RegulerButton
              onClick={() => null}
              className="hover:border-green-600 text-sm py-[8px] px-10 border-[2px] mt-3"
              key="SectionComponent"
            >
              Protect Me! 🔒
            </RegulerButton>
          </Section>
        </div>
      </Section>
    </div>
  );
};

export default ProfileStats;
