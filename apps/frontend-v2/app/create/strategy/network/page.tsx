"use client";
/**
 * Network config for the strategy
 */

import WrappedText from "components/wrappers/text";
import { ConfigTitle } from "../../../../components/strategy-config-title";
import Dropdown from "components/dropdown";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "components/dropdown/types";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useChainSwitch } from "utilities/hooks/web3/useChainSwitch";
import DropdownMenu from "components/dropdown/menu";
import { useMemo, useRef } from "react";

import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import WrappedImage from "components/wrappers/image";
import { StrategyConfigWrapper } from "components/strategy-config-wrapper";

const NetworkConfig = () => {
  // Get the networks from the global state
  const networks = useYCStore((state) => state.context.networks);

  // Get the network setter from the strategy config state
  const setNetwork = useStrategyStore((state) => state.setNetwork);

  // Get the current network choice to display
  const chosenNetwork = useStrategyStore((state) => state.network);

  // Parent ref so the dropdown menu is satisified
  const parentRef = useRef<HTMLDivElement>(null);

  // Set the colors
  useBackdropColorChange("#5c4", "#3aa");

  // Memoize the default choice to the dropdown component
  const dropdownChoice = useMemo(() => {
    return {
      data: chosenNetwork,
      text: chosenNetwork?.name,
      image: chosenNetwork?.logo,
    };
  }, [chosenNetwork]);

  return (
    <div
      className="flex flex-col items-center justify-between  w-[50%] h-[50%]"
      ref={parentRef}
    >
      <ConfigTitle>
        {"Choose A Network 🌐"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The blockchain network your vault will live inside of
        </WrappedText>{" "}
      </ConfigTitle>
      <StrategyConfigWrapper>
        <Dropdown
          choice={dropdownChoice}
          options={networks.map((network: YCNetwork): DropdownOption => {
            return {
              text: network.name,
              image: network.logo,
              data: network,
            };
          })}
          menuProps={{
            modalBehaviour: "always",
            style: {
              marginTop: "10px",
              paddingLeft: "1.2%",
              paddingRight: "1.2%",
            },
          }}
          choiceHandler={(choice: DropdownOption<YCNetwork>) =>
            setNetwork(choice.data)
          }
          manualModal
          buttonProps={{
            children: (
              <>
                <WrappedImage
                  className="rounded-full"
                  src={chosenNetwork?.logo}
                  width={32}
                  height={32}
                />
                <WrappedText fontSize={18} className="leading-none">
                  {chosenNetwork?.name}
                </WrappedText>
              </>
            ),
            style: {
              width: "300px",
            },
          }}
        />
      </StrategyConfigWrapper>
    </div>
  );
};

export default NetworkConfig;
