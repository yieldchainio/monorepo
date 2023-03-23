import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RegulerButton, RegulerButtonProps } from "../reguler";

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
                  <RegulerButton onClick={openConnectModal}>
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
