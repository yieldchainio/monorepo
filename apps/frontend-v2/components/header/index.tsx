"use client";
import { HeaderCatagoryText } from "./catagory-text";
import Button from "../buttons/gradient";
import Dropdown from "../dropdown";
import "../../css/globals.css";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "../dropdown/types";
import { useYCStore } from "utilities/stores/yc-data";
import WrappedImage from "components/wrappers/image";
import { ProfileModal } from "components/wallet-profile";
import ConnectWalletButton from "components/buttons/connect";
import { useChainSwitch } from "../../utilities/hooks/web3/useChainSwitch";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { ThemeSwitch } from "components/switches/theme";
import {
  MediaScreenSizes,
  useMediaBreakpoints,
} from "utilities/hooks/styles/useMediaBreakpoints";
import { sliceAddress } from "utilities/general/slice-address";

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
  const networks = useYCStore(
    (state) => state.context.networks,
    (a, b) => {
      return (
        JSON.stringify(a.map((network) => network.toString())) ==
        JSON.stringify(b.map((network) => network.toString()))
      );
    }
  );

  // Getting the switchNetwork function and the current connected chain
  const { switchNetwork, chain } = useChainSwitch();

  // Getting the user's address, username, profilepic & others to display for them
  const { address, userName, profilePic, createdVaults } = useYCUser();

  // Media breakpoints for some stuff
  const { proprety: logo } = useMediaBreakpoints<{
    light: string;
    dark: string;
  }>({
    [MediaScreenSizes.LAPTOP]: {
      light: "/brand/yc-logo-dark.png",
      dark: "/brand/yc-logo-light.png",
    },
    [MediaScreenSizes.ANY]: {
      light: "/brand/yc-full-dark.png",
      dark: "/brand/yc-full-light.svg",
    },
  });

  const { proprety: createVaultText } = useMediaBreakpoints<string>({
    [MediaScreenSizes.LAPTOP]: "+",
    [MediaScreenSizes.ANY]: "Create Vault",
  });

  const { proprety: catagoryTexts } = useMediaBreakpoints<any>(
    {
      [MediaScreenSizes.ANY]: (
        <div className="flex gap-4 w-[100%] h-[100%] items-center z-100">
          <HeaderCatagoryText text="Earn" page="/" />
          <HeaderCatagoryText text="Portfolio" page="/portfolio" />
          <HeaderCatagoryText text="My Vaults" page="/creator-dashboard" />
          <HeaderCatagoryText text="Stake YC" page="/stake-yc" />
        </div>
      ),
      [MediaScreenSizes.TABLET]: (
        <Dropdown
          options={[
            {
              text: "Earn",
              data: {},
            },
            {
              text: "Portfolio",
              data: {},
            },
            {
              text: "My Vaults",
              data: {},
            },
            {
              text: "Stake YC",
              data: {},
            },
          ]}
          choice={{
            text: "Earn",
            data: {},
          }}
          buttonProps={{
            className:
              "px-0 py-0 bg-transparent border-0 hover:bg-transparent gap-0 border-transparent hover:border-transparent hover:border-0  ",
          }}
          menuProps={{
            hideOptionText: "",
            optionProps: {
              wrapperClassname: "",
              textProps: {
                fontSize: 12,
              },
            },
            optionText(_option, i) {
              return (
                <HeaderCatagoryText
                  text="Stake YC"
                  page="/stake-yc"
                  fontSize={14}
                  fontColor={"custom-textColor"}
                />
              );
            },
          }}
          choiceHandler={(choice: DropdownOption) => null}
        ></Dropdown>
      ),
    },
    (item: any) => item
  );

  // Return the component
  return (
    <div
      className={`fixed flex w-[100vw] h-[9vh] items-center  justify-between pointer-events-auto z-1000 rounded-sm shadow-md`}
    >
      <div className="absolute w-full h-full overflow-hidden bg-transparent z-0 opacity-100 rounded-b-lg">
        <div className="absolute w-[100vw] h-[100%] bg-custom-header backdrop-blur-3xl bg-opacity-100 z-1 pointer-events-auto overflow-hidden"></div>
      </div>

      <div className="relative">
        <div className="flex w-[35%] h-[100%] gap-10 blur-none pl-10 items-center">
          <WrappedImage
            src={logo}
            alt=""
            width={150}
            height={100}
            className="z-100 blue-none"
          ></WrappedImage>
          {catagoryTexts}
        </div>
      </div>
      <div className="flex items-center justify-end h-[10vh] pr-10 blur-none gap-6">
        <span className="smallLaptop:hidden">
          <ThemeSwitch />
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
          textProps={{ className: "laptop:hidden" }}
          choice={
            networks.length
              ? (() => {
                  const network =
                    chain &&
                    networks.find((network) => network.chainid == chain.id);
                  if (network)
                    return {
                      text: network.name,
                      image: network.logo,
                      data: {
                        json_rpc: network.jsonrpc,
                        chain_id: network.chainid,
                        color: network.color,
                      },
                    };

                  console.log("Default network", chain, networks);
                  return undefined;
                })()
              : undefined
          }
        />
        {address ? (
          <Dropdown
            options={[
              ...[
                {
                  text: userName || sliceAddress(address),
                  image: profilePic || "",
                  data: {
                    name: "Ethereum",
                  },
                },
              ],
            ]}
            textProps={{ className: "laptop:hidden" }}
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
          <Button onClick={() => null} className=" relative font-semibold">
            {createVaultText}
          </Button>
        </div>
      </div>
    </div>
  );
};
