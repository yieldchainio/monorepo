/**
 * A Dropdown for protocols
 */

import { YCNetwork, YCProtocol, YCToken } from "@yc/yc-models";
import { all } from "axios";
import Dropdown from "components/dropdown";
import { DropdownOption, DropdownProps } from "components/dropdown/types";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { TokensModal } from "components/modals/tokens";
import { TokensModalProps } from "components/modals/tokens/types";
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
      setChoice: (protocol: YCProtocol) => void;
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

    /**
     * Memoize choice to display
     */
    const memoChoice = useMemo(
      () =>
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
            },
      [choice, choice?.id]
    );

    return (
      <InfoProvider
        contents={label || "Choose A Protocol"}
        direction={ToolTipDirection.LEFT}
        portal={portal}
      >
        <Dropdown
          type="searchable"
          options={dropdownProtocols}
          buttonProps={{
            style: {
              width: "100%",
              ...style,
            },
            className: className,
          }}
          choice={memoChoice}
          menuProps={{
            style: {
              height: "250px",
              zIndex: 1000,
              overflowY: "scroll",
            },
            className: "overflow-y-scroll scrollbar-hide",
          }}
          autoChoice={false}
          choiceHandler={(choice: DropdownOption<YCProtocol>) =>
            setChoice(choice.data)
          }
          {...dropdownProps}
        ></Dropdown>
      </InfoProvider>
    );
  }
);
