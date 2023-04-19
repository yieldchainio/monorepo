/**
 * A Dropdown for protocols
 */

import { YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";
import { all } from "axios";
import Dropdown from "components/dropdown";
import { DropdownProps } from "components/dropdown/types";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { TokensModal } from "components/tokens-modal";
import { TokensModalProps } from "components/tokens-modal/types";
import { forwardRef, useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";

export const ProtocolsDropdown = forwardRef(
  (
    {
      choice,
      setChoice,
      label,
      className,
      style,
      dropdownProps,
      portal,
      protocols,
    }: {
      choice?: YCProtocol | null;
      setChoice: (token: YCProtocol) => void;
      dropdownProps?: Partial<DropdownProps>;
      portal?: HTMLElement;
      protocols?: YCProtocol[];
    } & Partial<TokensModalProps>,
    ref
  ) => {
    /**
     * Get all protocols from context
     */
    const allProtocols = useYCStore((state) => state.context.protocols);

    /**
     * Memoize our protocols to use
     */
    const dropdownProtocols = useMemo(
      () =>
        (protocols || allProtocols).flatMap((protocol) =>
          protocol.available
            ? [
                {
                  text: protocol.name,
                  image: protocol.logo,
                  data: protocol,
                },
              ]
            : []
        ),
      [allProtocols, protocols, allProtocols.length, protocols?.length]
    );

    return (
      <InfoProvider
        contents={label || "Choose A Protocol"}
        direction={ToolTipDirection.LEFT}
        portal={portal}
      >
        <Dropdown
          options={dropdownProtocols}
          buttonProps={{
            style: {
              width: "100%",
              ...style,
            },
            className: className,
          }}
          choice={
            choice
              ? {
                  text: choice.name,
                  image: choice.logo,
                  data: choice,
                }
              : {
                  text: undefined,
                  image: undefined,
                  data: undefined,
                }
          }
          menuProps={{
            style: {
              height: "150px",
              zIndex: 1000,
              overflowY: "scroll",
            },
            className: "overflow-y-scroll scrollbar-hide",
          }}
          autoChoice={false}
          {...dropdownProps}
        ></Dropdown>
      </InfoProvider>
    );
  }
);
