"use client";
import Image from "next/image";
import { HeaderCatagoryText } from "./catagory-text";
import Button from "../buttons/main";
import Dropdown from "./dropdown";
import "../../css/globals.css";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "./dropdown/types";
import { useYCContext } from "utilities/stores/yc-data";
import { useHideScroll } from "utilities/hooks/useHideScroll";
import { useEffect, useState } from "react";
import { Switch } from "components/buttons/switch";

enum HeaderLocation {
  HIDDEN = "top-[-65px]",
  VISIBLE = "",
}

/**
 * @Header
 * The main header for the app
 * @returns The header
 */
export const Header = () => {
  const networks = useYCContext((state) => state.context.networks);
  const show = useHideScroll();
  const [headerLocation, setHeaderLocation] = useState<HeaderLocation>(
    HeaderLocation.VISIBLE
  );

  const [theme, setTheme] = useState(false);

  useEffect(() => {
    if (show) setHeaderLocation(HeaderLocation.VISIBLE);
    else setHeaderLocation(HeaderLocation.HIDDEN);
  }, [show]);
  return (
    <div
      className={`fixed flex w-[100vw] h-[9vh] items-center  justify-between drop-shadow-sm pointer-events-auto z-100 rounded-xl ${headerLocation}`}
    >
      <div className="absolute w-full h-full overflow-hidden bg-transparent z-0 opacity-100 rounded-xl drop-shadow-lg">
        <div className="absolute w-[100vw] h-[100%] bg-[#383838] opacity-[45%] filter blur-xl z-1 pointer-events-auto overflow-hidden rounded-xl"></div>
      </div>

      <div className="relative">
        <div className="flex w-[35vw] h-[100%] gap-10 blur-none pl-10">
          <Image
            src="/yieldchain-full.svg"
            alt=""
            width="150"
            height="100"
            className="z-100 blue-none"
          ></Image>
          <div className="flex gap-4 w-[100%] h-[100%] items-center z-100">
            <HeaderCatagoryText text="Earn" page="/" />
            <HeaderCatagoryText text="Portfolio" page="/portfolio" />
            <HeaderCatagoryText text="My Vaults" page="/creator-dashboard" />
            <HeaderCatagoryText text="Stake YC" page="/stake-yc" />
          </div>
        </div>
      </div>
      <div className="relative">
        <Switch handler={setTheme} />
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
        <div className="relative">
          <Button
            text="Create Vault"
            onClick={() => null}
            className="relative font-semibold"
          />
        </div>
      </div>
    </div>
  );
};
