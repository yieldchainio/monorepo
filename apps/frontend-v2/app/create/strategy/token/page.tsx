"use client";
/**
 * Network config for the strategy
 */

import WrappedText from "components/wrappers/text";
import { ConfigTitle } from "../../../../components/strategy-config-title";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { TokensModal } from "components/tokens-modal";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogs } from "utilities/hooks/stores/logger";
import { ErrorMessage } from "components/logger/components/error";
import Dropdown from "components/dropdown";
import { YCToken } from "@yc/yc-models";
import { ModalWrapper } from "components/modal-wrapper";
import WrappedImage from "components/wrappers/image";
import { StrategyConfigWrapper } from "components/strategy-config-wrapper";

const TokenConfig = () => {
  // Set the colors
  useBackdropColorChange("#aa2", "#Cea");

  // Get the chosen network to filter the tokens
  const chosenNetwork = useStrategyStore((state) => state.network);

  // Get the token setter from the strategy store
  const setToken = useStrategyStore((state) => state.setDepositToken);

  // Get chosen token to display
  const chosenToken = useStrategyStore(
    (state) => state.depositToken,
    (aToken, bToken) => aToken?.id == bToken?.id
  );

  // Get next router instance, navigate back to network section if undefined
  const router = useRouter();

  // Get logs store, push a log if network is undefined
  const logs = useLogs();

  // We only allow to visit this page if you've set your network already
  useEffect(() => {
    if (!chosenNetwork) {
      logs.push((id: string) => ({
        component: (
          <ErrorMessage id={id}>Please Choose A Network First!</ErrorMessage>
        ),
        data: "",
        lifespan: 5000,
        id,
      }));

      router.replace("/create/strategy/network");
    }
  }, [chosenNetwork]);

  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[50%]">
      <ConfigTitle>
        {"Pick A Deposit Token 🍪"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The token that you & others will deposit into the vault
        </WrappedText>{" "}
      </ConfigTitle>
      <StrategyConfigWrapper>
        <Dropdown
          options={[]}
          choice={
            chosenToken
              ? {
                  text: chosenToken?.symbol,
                  image: chosenToken?.logo,
                  data: chosenToken,
                }
              : undefined
          }
          manualModal={true}
          buttonProps={{
            children: (
              <>
                <WrappedImage
                  className="rounded-full"
                  src={chosenToken?.logo}
                  width={32}
                  height={32}
                />
                <WrappedText fontSize={18} className="leading-none">
                  {chosenToken?.symbol}
                </WrappedText>
              </>
            ),
            style: {
              width: "300px",
            },
          }}
        >
          <TokensModal
            handleChoice={setToken}
            allowedNetworks={chosenNetwork ? [chosenNetwork] : undefined}
          />
        </Dropdown>
      </StrategyConfigWrapper>
      {/* <TokensModal
        handleChoice={setToken}
        allowedNetworks={chosenNetwork ? [chosenNetwork] : undefined}
      /> */}
    </div>
  );
};

export default TokenConfig;
