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
import { TokensModal } from "components/tokens-modal";
import { TokensModalProps } from "components/tokens-modal/types";
import { forwardRef } from "react";

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
    return (
      <InfoProvider
        contents={label}
        direction={ToolTipDirection.LEFT}
        portal={portal}
      >
        <Dropdown
          options={[]}
          buttonProps={{
            style: {
              width: "100%",
              ...style,
            },
            className: className,
          }}
          manualModal={true}
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
        >
          <TokensModal
            handleChoice={(token) => setChoice(token)}
            allowedNetworks={network ? [network] : undefined}
            allowedTokens={tokens || undefined}
            label={label}
          />
        </Dropdown>
      </InfoProvider>
    );
  }
);
