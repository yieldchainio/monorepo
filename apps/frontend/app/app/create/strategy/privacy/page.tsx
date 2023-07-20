"use client";
import { RegulerButton } from "components/buttons/reguler";
import { GradientBorder } from "components/gradient-border";
import { UpgradeTierModal } from "components/modals/upgrade";
import { PrivacyCard } from "components/privacy-card";
/**
 * Privacy config for the strategy
 */

import { ConfigTitle } from "components/strategy-config-title";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import WrappedText from "components/wrappers/text";
import { useMemo } from "react";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { useModals } from "utilities/hooks/stores/modal";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import useYCUser from "utilities/hooks/yc/useYCUser";

function PrivacyConfig() {
  const modals = useModals();
  // Set the colors
  useBackdropColorChange("#00FF75", "#BD0088");

  // Current privacy choice
  const privacyChoice = useStrategyStore((state) => state.isPublic);

  // Get the privacy setter
  const setPrivacy = useStrategyStore((state) => state.setPrivacy);

  const { tier } = useYCUser();

  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[100%] overflow-visible mt-[10vh]">
      <ConfigTitle>
        {"Set Vault's Visibility 👀"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          A public good, or secret alpha? 🤔
        </WrappedText>{" "}
      </ConfigTitle>
      <StrategyConfigVerticalWrapper>
        <div className="w-full flex flex-row gap-6 justify-between mt-10 -z-1">
          <PrivacyCard
            title="Private"
            blocked={tier.id == 0}
            blockedContent={
              <div className="w-full h-full absolute bg-custom-bg/60 top-0 left-0 backdrop-blur-2xl flex flex-col items-center justify-start py-20 px-12 gap-8">
                <WrappedText
                  fontSize={36}
                  fontStyle="bold"
                  className="whitespace-pre-wrap text-center"
                >
                  Only Premium Users Can Create Private Vaults
                </WrappedText>
                <RegulerButton
                  className="border-blue-500/40 hover:border-blue-500/70"
                  onClick={() => modals.lazyPush(<UpgradeTierModal />)}
                >
                  <WrappedText>Upgrade Now 💎</WrappedText>
                </RegulerButton>
              </div>
            }
            subtitle="Only you & users you whitelist will be allowed into the vault."
            position="left"
            chosen={!privacyChoice}
            lightColor="#760039"
            heavyColor="#de04da"
            setOwn={(chose: boolean) => setPrivacy(!chose)}
            emojies="🕵️🔒"
            reasons={[
              {
                reason: "Non-diluted Yields",
                description: "Keep that alpha for yourselves.",
              },
              {
                reason: "Whitelisted Access",
                description: "Use vault access as a premium incentive",
              },
            ]}
          />
          <PrivacyCard
            title="Public"
            subtitle="Your vault will be publicly visible & accessible by anyone. "
            position="right"
            chosen={privacyChoice}
            heavyColor="#00C6BA"
            lightColor="#00FF38"
            setOwn={(chose: boolean) => setPrivacy(chose)}
            emojies="🔎✅ "
            reasons={[
              {
                reason: "Gas Bundling",
                description: "More frens == Less Gas!",
              },
              {
                reason: "Increased Reputation",
                description: "Become a chad, give back to the community",
              },
            ]}
          />
        </div>
      </StrategyConfigVerticalWrapper>
    </div>
  );
}

export default PrivacyConfig;
