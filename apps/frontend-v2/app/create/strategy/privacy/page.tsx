"use client";
import { GradientBorder } from "components/gradient-border";
import { PrivacyCard } from "components/privacy-card";
/**
 * Privacy config for the strategy
 */

import { ConfigTitle } from "components/strategy-config-title";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import WrappedText from "components/wrappers/text";
import { useMemo } from "react";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { useStrategyStore } from "utilities/hooks/stores/strategies";

const PrivacyConfig = () => {
  // Set the colors
  useBackdropColorChange("#00FF75", "#BD0088");

  // Current privacy choice
  const privacyChoice = useStrategyStore((state) => state.isPublic);

  // Get the privacy setter
  const setPrivacy = useStrategyStore((state) => state.setPrivacy);

  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[200vh] overflow-visible">
      <ConfigTitle>
        {"Set Vault's Visibility 👀"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          A public good, or secret alpha? 🤔
        </WrappedText>{" "}
      </ConfigTitle>
      <StrategyConfigVerticalWrapper>
        <div className="w-full flex flex-row gap-6 justify-between mt-10 z-0">
          <PrivacyCard
            title="Private"
            subtitle="Only you & users you whitelist will be allowed into the vault."
            position="left"
            chosen={!privacyChoice}
            lightColor="#760039"
            heavyColor="#D91B0F"
            setOwn={() => setPrivacy(false)}
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
            setOwn={() => setPrivacy(true)}
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
};

export default PrivacyConfig;
