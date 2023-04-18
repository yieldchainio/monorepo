/**
 * Component for token swap,
 * has 2 ChooseToken components and an arrow, with some negative margins
 */

import { YCNetwork, YCToken } from "@yc/yc-models";
import { TokensModalProps } from "components/tokens-modal/types";
import WrappedImage from "components/wrappers/image";
import { CSSProperties, forwardRef } from "react";
import { ChooseToken } from "../choose-token";
import { RegulerButtonProps } from "components/buttons/reguler/types";
import { DropdownProps } from "components/dropdown/types";

export const TokenSwap = forwardRef(
  (
    {
      fromToken,
      setFromToken,
      toToken,
      setToToken,
      label,
      network,
      tokens,
      className,
      dropdownProps,
      bottomDropdownProps,
    }: {
      network?: YCNetwork | null;
      tokens?: YCToken[] | null;
      toToken?: YCToken | null;
      fromToken: YCToken | null;
      setFromToken: (token: YCToken) => void;
      setToToken: (token: YCToken) => void;
      dropdownProps?: Partial<DropdownProps>;
      bottomDropdownProps?: Partial<DropdownProps>;
    } & Partial<TokensModalProps>,
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <ChooseToken
          label="From"
          network={network}
          tokens={tokens}
          choice={fromToken}
          setChoice={setFromToken}
          dropdownProps={dropdownProps}
        />

        <div className="w-[25px] h-[25px] border-[1px] border-custom-themedBorder rounded-md mx-auto -mt-3 z-10 bg-custom-bcomponentbg flex items-center justify-center">
          <WrappedImage
            src={{
              dark: "/icons/arrow-light.svg",
              light: "/icons/arrow-dark.svg",
            }}
            className="w-[60%] h-[60%]"
          />
        </div>
        <ChooseToken
          label="To"
          network={network}
          choice={toToken}
          setChoice={setToToken}
          className="-mt-3"
          dropdownProps={{ ...dropdownProps, ...bottomDropdownProps }}
        />
      </div>
    );
  }
);