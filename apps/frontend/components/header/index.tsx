"use client";
import { HeaderCatagoryText } from "./catagory-text";
import Button from "../buttons/gradient";
import Dropdown from "../dropdown";
import "css/globals.css";
import { YCNetwork } from "@yc/yc-models";
import { DropdownOption } from "../dropdown/types";
import { useYCStore } from "utilities/hooks/stores/yc-data";
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
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Accordion } from "./accordion";
import { useStateEffect } from "utilities/hooks/general/useStateEffect";
import { useRouter } from "next/navigation";
import { useScrollDirection } from "utilities/hooks/styles/useHideScroll";

enum HeaderLocation {
  HIDDEN = "top-[-65px]",
  VISIBLE = "",
}

/**
 * @Header
 * The main header for the app
 * @returns The header
 */
export function Header() {
  // Use the networks from the context
  const networks: YCNetwork[] = useYCStore(
    (state) => state.context.networks,
    (a, b) => {
      return (
        JSON.stringify(a.map((network: YCNetwork) => network.stringify())) ==
        JSON.stringify(b.map((network: YCNetwork) => network.stringify()))
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

  // next router
  const router = useRouter();

  // We get the scorlling direction to hide the header hwen scrolling down
  const scrollDirection = useScrollDirection();
  const topMargin = useMemo(
    () => (scrollDirection == "down" ? "-top-24" : "top-0"),
    [scrollDirection]
  );
  // Return the component
  return (
    <div
      className={`flex flex-row items-center justify-between bg-custom-bg bg-opacity-30 backdrop-blur-sm sticky z-50 ${topMargin} transition-all duration-500  h-20 shadow-md `}
    >
      {/* <div className="absolute w-full h-full overflow-hidden bg-transparent z-0 opacity-100 rounded-b-lg ">
        <div className="absolute w-[100vw] h-[100%] bg-custom-header backdrop-blur-3xl bg-opacity-100 z-1 pointer-events-auto overflow-hidden"></div>
      </div> */}

      <div className="relative">
        <div className="flex w-[35%] h-[100%] gap-10 blur-none pl-10 items-center">
          <WrappedImage
            src={logo}
            alt=""
            width={150}
            height={100}
            className="z-100 blue-none"
          ></WrappedImage>
          <HeaderRoutes />
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
                json_rpc: network.jsonRpc,
                chain_id: network.id,
                color: network.color,
              },
            };
          })}
          choiceHandler={async (
            _choice: DropdownOption<{ chain_id: number }>
          ) => {
            return await switchNetwork(_choice.data.chain_id);
          }}
          textProps={{ className: "laptop:hidden", fontSize: 16 }}
          choice={
            networks.length
              ? (() => {
                  const network =
                    chain && networks.find((network) => network.id == chain.id);
                  if (network)
                    return {
                      text: network.name,
                      image: network.logo,
                      data: {
                        json_rpc: network.jsonRpc,
                        chain_id: network.id,
                        color: network.color,
                      },
                    };

                  return undefined;
                })()
              : undefined
          }
          menuProps={{
            hideOptionText: "laptop:hidden",
          }}
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
            textProps={{ className: "laptop:hidden", fontSize: 16 }}
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
          <InfoProvider
            contents="Create A Vault"
            direction={ToolTipDirection.BOTTOM}
          >
            <Button
              onClick={() => router.push("/app/create/strategy")}
              className=" relative font-semibold"
            >
              {createVaultText}
            </Button>
          </InfoProvider>
        </div>
      </div>
    </div>
  );
}

/**
 * A component wrapping the catagories of the header
 */

function HeaderRoutes() {
  const { proprety: component }: { proprety: React.ReactNode } =
    useMediaBreakpoints<React.ReactNode>(
      {
        [MediaScreenSizes.TABLET]: (
          <Accordion
            catagories={[
              {
                label: "Earn",
                page: "/",
                icon: {
                  light: "/icons/earn-dark.svg",
                  dark: "/icons/earn-light.svg",
                },
              },
              {
                label: "Portfolio",
                page: "/portfolio",
                icon: {
                  dark: "/icons/portfolio-light.svg",
                  light: "/icons/portfolio-dark.svg",
                },
              },
              {
                label: "My Vaults",
                page: "/creator-dashboard",
                icon: {
                  dark: "/icons/creator-light.svg",
                  light: "/icons/creator-dark.svg",
                },
              },
              {
                label: "Stake YC",
                page: "/stake-yc",
                icon: {
                  dark: "/icons/stake-light.svg",
                  light: "/icons/stake-dark.svg",
                },
              },
            ]}
          />
        ),
        [MediaScreenSizes.ANY]: (
          <div className="flex gap-4 w-[100%] h-[100%] items-center z-100">
            <HeaderCatagoryText text="Earn" page="/app" />
            <HeaderCatagoryText text="Portfolio" page="app/portfolio" />
            <HeaderCatagoryText text="My Vaults" page="app/creator-dashboard" />
            <HeaderCatagoryText text="Stake YC" page="app/stake-yc" />
          </div>
        ),
      },
      (item) => item.toString()
    );
  return <>{component}</>;
}
