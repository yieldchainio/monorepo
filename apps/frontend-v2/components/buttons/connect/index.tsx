"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RegulerButton } from "../reguler";
import { RegulerButtonProps } from "../reguler/types";

/**
 * A custom connect wallet button
 */

const ConnectWalletButton = ({ className, children }: RegulerButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <RegulerButton
                    onClick={openConnectModal}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: "0px",
                    }}
                  >
                    {" "}
                    Connect Wallet
                  </RegulerButton>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
export default ConnectWalletButton;
