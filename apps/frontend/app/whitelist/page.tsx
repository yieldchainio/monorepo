"use client";
import ConnectWalletButton from "components/buttons/connect";
import WrappedText from "components/wrappers/text";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";

import { SocialMediasSection } from "./components/social-media-section";
import { useRouter, useSearchParams } from "next/navigation";
import { signMessage } from "@wagmi/core";
import { RegulerButton } from "components/buttons/reguler";

const WhitelistingStatusTitle = {
  null: "Wen Whitelist? 👀",
  true: "Whitelisted ✅",
  false: "Not Whitelisted :/ (yet?)",
};

const WhitelistingStatusSubTitle = {
  null: "Connect a Web3 wallet to check your whitelist status",
  true: "Redirecting you to the app...",
  false:
    "You were automatically signed up. Sharing this page on your socials & adding them below will make whitelisting faster 🚀",
};

const WhitelistingStatusColors: Record<
  `${null}` | `${boolean}`,
  [string, string]
> = {
  null: ["rgb(1, 178, 236)", "rgb(217, 202, 15)"],
  true: ["rgb(50, 100, 10)", "rgb(10, 200, 10)"],
  false: ["rgb(250, 100, 20)", "rgb(200,150, 600)"],
};

const WhitelistingStatusToComponents: Record<
  `${null}` | `${boolean}`,
  React.ReactNode
> = {
  null: <ConnectWalletButton />,
  true: (
    <div className="flex flex-col items-center justify-center">
      <WrappedText>Let's Just Prove It's REALLY You</WrappedText>
      <RegulerButton
        onClick={async () =>
          localStorage.setItem(
            "ETH_AUTH_SIG",
            await signMessage({
              message: "Yieldchain Whitelistooor",
            })
          )
        }
      >
        Sign
      </RegulerButton>
    </div>
  ),
  false: <SocialMediasSection />,
};

function WhitelistPage() {
  const { address, whitelisted, connected } = useYCUser();

  const isWhitelisted = useMemo(
    () => (address && connected ? whitelisted : null),
    [address, whitelisted]
  );

  const router = useRouter();

  const params = useSearchParams();

  const sig = localStorage.getItem("ETH_AUTH_SIG");

  useEffect(() => {
    if (isWhitelisted && sig)
      setTimeout(() => {
        const path = params.get("callback");

        router.replace((path?.includes("/app") ? path : "/app") || "/app");
      }, 1000);
  }, [isWhitelisted, sig]);

  return (
    <div className="flex flex-col items-center overflow-hidden justify-start bg-custom-bg w-[100vw] h-[var(--viewport-height)] z-0 absolute pt-[15vh] gap-12">
      <div className="flex flex-col items-center">
        <WrappedText
          fontSize={52}
          fontStyle="black"
          className="mobile:text-[34px]"
        >
          {WhitelistingStatusTitle[`${isWhitelisted}`]}
        </WrappedText>
        <WrappedText
          fontSize={22}
          className="max-w-[70%] whitespace-pre-wrap text-center mobile:text-[19px] "
        >
          {WhitelistingStatusSubTitle[`${isWhitelisted}`]}
        </WrappedText>
      </div>
      <GradientBackdrop
        colorA={WhitelistingStatusColors[`${isWhitelisted}`][0]}
        colorB={WhitelistingStatusColors[`${isWhitelisted}`][1]}
      />
      {WhitelistingStatusToComponents[`${isWhitelisted}`]}
    </div>
  );
}
export default WhitelistPage;

const GradientBackdrop = ({
  colorA = "rgb(1, 178, 236)",
  colorB = "rgb(217, 202, 15)",
}: {
  colorA?: string;
  colorB?: string;
}) => {
  return (
    <motion.div
      className="w-[120%] h-[110%] opacity-[0.7] blur-[150px] overflow-hidden z-[-100] absolute top-[70%]"
      layout
      initial={{
        background: `linear-gradient(20deg, ${colorA} 0%, ${colorB} 100%)`,
      }}
      animate={{
        background: `linear-gradient(180deg, ${colorA} 0%, ${colorB} 100%)`,
      }}
      transition={{
        duration: 3.8,
        repeat: Infinity,
        delay: Math.random() * Math.random() * 1,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    ></motion.div>
  );
};
