/**
 * Component for token swap,
 * has 2 ChooseToken components and an arrow, with some negative margins
 */

import { YCNetwork, YCToken } from "@yc/yc-models";
import { TokensModalProps } from "components/modals/tokens/types";
import WrappedImage from "components/wrappers/image";
import { forwardRef, useMemo } from "react";
import { ChooseToken } from "../../../components/choose-token";
import { DropdownProps } from "components/dropdown/types";

/* eslint-disable react/display-name */
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
      portal,
    }: {
      network?: YCNetwork | null;
      tokens?:
        | YCToken[]
        | null
        | {
            from: YCToken[] | undefined | null;
            to: YCToken[] | undefined | null;
          };
      toToken?: YCToken | null;
      fromToken: YCToken | null;
      setFromToken: (token: YCToken) => void;
      setToToken: (token: YCToken) => void;
      dropdownProps?: Partial<DropdownProps>;
      bottomDropdownProps?: Partial<DropdownProps>;
      portal?: HTMLElement;
    } & Partial<TokensModalProps>,
    ref
  ) => {
    const { fromTokens, toTokens } = useMemo(() => {
      if (!tokens) return { fromTokens: null, toTokens: null };
      if (Array.isArray(tokens))
        return { fromTokens: tokens, toTokens: undefined };

      return {
        fromTokens: tokens.from,
        toTokens: tokens.to,
      };
    }, [
      tokens,
      (tokens as any[] | null | undefined)?.["length"],
      (tokens as any | null)?.from,
      (tokens as any | null)?.to,
    ]);

    return (
      <div className="flex flex-col gap-1 w-full">
        <ChooseToken
          label="From"
          network={network}
          tokens={fromTokens}
          choice={fromToken}
          setChoice={setFromToken}
          dropdownProps={dropdownProps}
          portal={portal}
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
          tokens={toTokens}
          setChoice={setToToken}
          className="-mt-3"
          dropdownProps={{ ...dropdownProps, ...bottomDropdownProps }}
          portal={portal}
        />
      </div>
    );
  }
);
