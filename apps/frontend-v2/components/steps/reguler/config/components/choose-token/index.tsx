/**
 * A generic dropdown-like component for choosing a token.
 *
 * It is clicked and the tokens modal opens
 */

import { YCNetwork, YCToken } from "@yc/yc-models";
import Dropdown from "components/dropdown";
import { DropdownProps } from "components/dropdown/types";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { TokensModal } from "components/modals/tokens";
import { TokensModalProps } from "components/modals/tokens/types";
import { forwardRef, useEffect, useMemo } from "react";

export const ChooseToken = forwardRef(
  (
    {
      choice,
      setChoice,
      label,
      network,
      tokens,
      className,
      style,
      dropdownProps,
      portal,
    }: {
      choice?: YCToken | null;
      setChoice: (token: YCToken) => void;
      network?: YCNetwork | null;
      tokens?: YCToken[] | null;
      dropdownProps?: Partial<DropdownProps>;
      portal?: HTMLElement;
    } & Partial<TokensModalProps>,
    ref
  ) => {
    const tokensToUse = useMemo(() => {
      if (!tokens) return undefined;
      return [...(tokens || [])];
    }, [tokens, tokens?.length]);

    useEffect(() => {
      console.log("Running TOkens Lenght THing");
      if (tokens?.length == 1) setChoice(tokens[0]);
    }, [tokens?.length]);

    return (
      <InfoProvider
        contents={label}
        direction={ToolTipDirection.LEFT}
        portal={portal}
      >
        <Dropdown
          options={[]}
          manualModal
          choice={
            choice
              ? {
                  text: choice.symbol,
                  image: choice.logo,
                  data: choice,
                }
              : {
                  text: label,
                  image: undefined,
                  data: undefined,
                }
          }
          {...dropdownProps}
          buttonProps={{
            ...(dropdownProps?.buttonProps || {}),
            ...{
              style: {
                width: "100%",
                ...style,
                ...dropdownProps?.buttonProps?.style,
              },
              className: className,
            },
          }}
          disableChoosing={(tokens?.length || 2) > 1 ? false : true}
        >
          <TokensModal
            handleChoice={(token) => setChoice(token)}
            allowedNetworks={network ? [network] : undefined}
            allowedTokens={tokensToUse}
            label={label}
          />
        </Dropdown>
      </InfoProvider>
    );
  }
);
