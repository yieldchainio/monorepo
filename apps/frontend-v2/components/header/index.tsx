"use client";
import { HeaderCatagoryText } from "./catagory-text";
import Button from "../buttons/gradient";
import Dropdown from "../dropdown";
import "../../css/globals.css";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "../dropdown/types";
import { useYCStore } from "utilities/stores/yc-data";
import { Switch } from "components/buttons/switch";
import WrappedImage from "components/wrappers/image";
import { ProfileModal } from "components/wallet-profile";
import ConnectWalletButton from "components/buttons/connect";
import { useChainSwitch } from "../../utilities/hooks/web3/useChainSwitch";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { Themes, useTheme } from "utilities/stores/theme";

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
  // Use the networks from the context
  const networks = useYCStore((state) => state.context.networks);

  // Use the theme
  const theme = useTheme((state) => state.theme);
  const setTheme = useTheme((state) => state.setTheme);

  const { switchNetwork } = useChainSwitch();

  const { address, userName, profilePic, createdVaults } = useYCUser();

  return (
    <div
      className={`fixed flex w-[100vw] h-[9vh] items-center  justify-between drop-shadow-sm pointer-events-auto z-100 rounded-xl`}
    >
      <div className="absolute w-full h-full overflow-hidden bg-transparent z-0 opacity-100 rounded-xl drop-shadow-lg">
        <div className="absolute w-[100vw] h-[100%] bg-custom-header backdrop-blur-xl z-1 pointer-events-auto overflow-hidden rounded-xl"></div>
      </div>

      <div className="relative">
        <div className="flex w-[35vw] h-[100%] gap-10 blur-none pl-10">
          <WrappedImage
            src={{
              light: "/brand/yc-full-dark.png",
              dark: "/brand/yc-full-light.svg",
            }}
            alt=""
            width={150}
            height={100}
            className="z-100 blue-none"
          ></WrappedImage>
          <div className="flex gap-4 w-[100%] h-[100%] items-center z-100">
            <HeaderCatagoryText text="Earn" page="/" />
            <HeaderCatagoryText text="Portfolio" page="/portfolio" />
            <HeaderCatagoryText text="My Vaults" page="/creator-dashboard" />
            <HeaderCatagoryText text="Stake YC" page="/stake-yc" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end w-[100%] h-[10vh] pr-10 blur-none gap-6">
        <span className="smallLaptop:hidden">
          <Switch
            handler={(on: boolean) => setTheme(on ? Themes.LIGHT : Themes.DARK)}
            images={{
              offImage: "/icons/moon.svg",
              onImage: "/icons/sun.svg",
            }}
          />
        </span>
        <Dropdown
          options={networks.map((network: YCNetwork): DropdownOption => {
            return {
              text: network.name,
              image: network.logo,
              data: {
                json_rpc: network.jsonrpc,
                chain_id: network.chainid,
                color: network.color,
              },
            };
          })}
          choiceHandler={async (
            _choice: DropdownOption<{ chain_id: number }>
          ) => {
            return await switchNetwork(_choice.data.chain_id);
          }}
        />
        {address ? (
          <Dropdown
            options={[
              ...[
                {
                  text:
                    userName ||
                    address?.slice(0, 4) +
                      "..." +
                      address?.slice(address.length - 4, address.length),
                  image: profilePic || "",
                  data: {
                    name: "Ethereum",
                  },
                },
              ],
            ]}
            choice={{
              text:
                userName ||
                address?.slice(0, 4) +
                  "..." +
                  address?.slice(address.length - 4, address.length),
              image: profilePic || "",
              data: {
                name: "Ethereum",
              },
            }}
          >
            <ProfileModal />
          </Dropdown>
        ) : (
          <>
            <ConnectWalletButton />
          </>
        )}

        <div className="relative">
          <Button
            text={window.innerWidth < 1000 ? "+" : "Create Vault"}
            onClick={() => null}
            className=" relative font-semibold"
          />
        </div>
      </div>
    </div>
  );
};
