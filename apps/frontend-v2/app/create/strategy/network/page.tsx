"use client";
/**
 * Network config for the strategy
 */

import WrappedText from "components/wrappers/text";
import { ConfigTitle } from "../_components/title";
import Dropdown from "components/dropdown";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "components/dropdown/types";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useChainSwitch } from "utilities/hooks/web3/useChainSwitch";
import DropdownMenu from "components/dropdown/menu";
import { useRef } from "react";

const NetworkConfig = () => {
  // Get the networks from the global state
  const networks = useYCStore((state) => state.context.networks);

  // Get the network setter from the strategy config state
  const setNetwork = useStrategyStore((state) => state.setNetwork);

  // Get the user's current chain for the default choice
  const { chain } = useChainSwitch();

  // Parent ref so the dropdown menu is satisified
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col items-center justify-between  w-[50%] h-[70%]"
      ref={parentRef}
    >
      <ConfigTitle>
        {"Choose A Network 🌐"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The blockchain network your vault will live inside of
        </WrappedText>{" "}
      </ConfigTitle>
      <DropdownMenu
        options={networks.map((network: YCNetwork): DropdownOption => {
          return {
            text: network.name,
            image: network.logo,
            data: network,
          };
        })}
        handler={(_choice: DropdownOption<YCNetwork>) =>
          setNetwork(_choice.data)
        }
        modalBehaviour="always"
        parentRef={parentRef}
        optionProps={{
          className:
            "focus:border-[2px] focus:border-custom-border focus:ring-violet-300",
        }}
        choiceFocusClass="border-[1px] border-custom-border transition duration-200"
        style={{
          width: "30vw",
          minWidth: "200px",
        }}
        className="tablet:w-[50vw]"
      />
    </div>
  );
};

export default NetworkConfig;
