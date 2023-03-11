"use client";
import Image from "next/image";
import { HeaderCatagoryText } from "./catagory-text";
import Button from "../buttons/main";
import Dropdown from "./dropdown";
import "../../css/globals.css";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "./dropdown/types";
import { useYCContext } from "utilities/stores/yc-data";

/**
 * @Header
 * The main header for the app
 * @returns The header
 */
export const Header = () => {
  const networks = useYCContext((state) => state.context.networks());
  return (
    <div className="fixed flex w-[100vw] h-[9vh] items-center  justify-between drop-shadow-sm pointer-events-auto z-100">
      <div className="absolute w-full h-full overflow-hidden bg-blue-900 z-0 opacity-0">
        <div className="absolute w-[100vw] h-[100%] bg-custom-header blur-xl opacity-30 z-1 pointer-events-auto overflow-hidden"></div>
      </div>

      <div className="flex w-[35vw] h-[100%] gap-10 blur-none pl-10">
        <Image
          src="/yieldchain-full.svg"
          alt=""
          width="150"
          height="100"
          className="z-100"
        ></Image>
        <div className="flex gap-4 w-[100%] h-[100%] items-center z-100">
          <HeaderCatagoryText text="Earn" page="/" />
          <HeaderCatagoryText text="Portfolio" page="/portfolio" />
          <HeaderCatagoryText text="My Vaults" page="/creator-dashboard" />
          <HeaderCatagoryText text="Stake YC" page="/stake-yc" />
        </div>
      </div>
      <div className="flex items-center justify-end w-[50%] h-[10vh] pr-10 blur-none gap-6">
        <Dropdown
          options={networks.map((network: YCNetwork): DropdownOption => {
            return {
              text: network.name,
              image: network.logo,
              data: {
                json_rpc: network.jsonrpc,
              },
            };
          })}
          // options={[
          //   {
          //     text: "Ethereum",
          //     image: "/icons/ethd.png",
          //     data: {
          //       name: "Ethereum",
          //     },
          //   },
          //   {
          //     text: "BNB Chain",
          //     image: "/icons/ethd.png",
          //     data: {
          //       name: "Ethereum",
          //     },
          //   },
          //   {
          //     text: "Avalanche",
          //     image: "/icons/ethd.png",
          //     data: {
          //       name: "Ethereum",
          //     },
          //   },
          //   {
          //     text: "Arbitrum",
          //     image: "/icons/ethd.png",
          //     data: {
          //       name: "Ethereum",
          //     },
          //   },
          //   {
          //     text: "Optimism",
          //     image: "/icons/ethd.png",
          //     data: {
          //       name: "Ethereum",
          //     },
          //   },
          // ]}
        />
        <Dropdown
          options={[
            {
              text: "0xc9...12",
              image: "/icons/ethd.png",
              data: {
                name: "Ethereum",
              },
            },
          ]}
        />
        <Button text="Create Vault" onClick={() => null} />
      </div>
    </div>
  );
};
