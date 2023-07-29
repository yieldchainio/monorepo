"use client";
import { CloseButton } from "components/buttons/close";
import { RegulerButton } from "components/buttons/reguler";
import { UpgradeTierModal } from "components/modals/upgrade";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { MouseEvent, useEffect, useState } from "react";
import { getLocalItem } from "utilities/general/local-storage";
import { useModals } from "utilities/hooks/stores/modal";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const PremiumAd = () => {
  const modals = useModals();

  const [shouldShow, setShouldShow] = useState<boolean>(false);

  useEffect(() => {
    if (!getLocalItem("HIDE_PREMIUM_AD")) setShouldShow(true);
  }, []);

  const tier = useYCStore((state) => state.context.tiers[1]);

  if (!shouldShow) return null;

  const hideAd = (
    e?: MouseEvent<HTMLDivElement, globalThis.MouseEvent> | undefined
  ) => {
    e?.stopPropagation();
    setShouldShow(false);
    localStorage.setItem("HIDE_PREMIUM_AD", "true");
  };

  return (
    <div className="fixed top-[100%] translate-y-[-118%] left-[100%] translate-x-[-108%] z-10000000 group border-custom-border">
      <div className="relative">
        <VaultImage />
        <div className="bg-gradient-to-r  from-custom-ycb/50 to-custom-ycy/50 w-[400px] h-[200px] rounded-lg p-[1px]">
          <div className="flex flex-col gap-2 bg-custom-bcomponentbg py-6 px-8 w-full h-full rounded-lg">
            <CloseButton onClick={hideAd} />
            <div className="flex flex-col ">
              <WrappedText fontStyle="bold" fontSize={20}>
                Create Private Vaults
              </WrappedText>
              <WrappedText fontSize={12} className="text-opacity-50">
                Upgrade To Premium Now To:
              </WrappedText>
            </div>
            <div className="w-full  flex flex-row flex-wrap gap-1 items-center h-[50%]">
              {tier.benefits.map((benefit: string, i, arr) =>
                i > 4 ? (
                  i == arr.length - 1 ? (
                    <div className="flex flex-row gap-[3px]" key={"Much More"}>
                      <WrappedImage
                        src="/icons/green-checkmark-full.svg"
                        className="rounded-full"
                        width={12}
                        height={12}
                      />
                      <WrappedText fontSize={10}>And Much More...</WrappedText>
                    </div>
                  ) : null
                ) : (
                  <div
                    className="flex flex-row gap-[3px]"
                    key={benefit + `${i}`}
                  >
                    <WrappedImage
                      src="/icons/green-checkmark-full.svg"
                      className="rounded-full"
                      width={12}
                      height={12}
                    />
                    <WrappedText fontSize={10}>{benefit}</WrappedText>
                  </div>
                )
              )}
            </div>
            <RegulerButton
              className="border-blue-500/40 hover:border-blue-500/70"
              onClick={(e) => {
                hideAd(e);
                modals.lazyPush(<UpgradeTierModal />);
              }}
            >
              <WrappedText>Upgrade Now 💎</WrappedText>
            </RegulerButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const VaultImage = () => {
  return (
    <WrappedImage
      src={{
        dark: "/icons/3d-vault-dark.png",
        light: "/icons/3d-vault-light.png",
      }}
      className=" scale-x-[-1]  absolute  top-0 left-[100%] translate-x-[-80%] translate-y-[5%] group-hover:translate-x-[-78%] group-hover:translate-y-[2%] transition-all duration-200 ease-in-out"
      width={220}
      height={220}
    />
  );
};
