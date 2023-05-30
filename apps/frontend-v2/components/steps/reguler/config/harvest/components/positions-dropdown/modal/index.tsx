/**
 * The positions modal,
 * shows a table with protocol, origin positon, and claimable position
 * @param claimFunctions - the claim/harvest functions. We are able to trace both protocol & parent function from that
 */

import { YCFunc } from "@yc/yc-models";
import { RegulerButton } from "components/buttons/reguler";
import { InfoProvider } from "components/info-providers";
import { ProtocolsProvider } from "components/info-providers/protocols";
import { Table } from "components/table";
import { TokensBundle } from "components/tokens/bundle";
import { BaseModalChildProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useMemo } from "react";

export const PositionsModal = ({
  claimFunctions,
  handleChoice,
  closeModal,
  ...props
}: {
  claimFunctions: YCFunc[];
  handleChoice: (func: YCFunc) => void;
} & BaseModalChildProps) => {
  // Return the JSX
  return (
    <div
      className="mx-auto w-[60%] h-[50%] bg-custom-bcomponentbg border-[1px] border-custom-themedBorder rounded-large py-10 px-8 overflow-y-scroll scrollbar-hide"
      onClick={props.onClick}
    >
      <Table<YCFunc>
        sections={[
          {
            label: "Protocol",
            callback: (item: YCFunc) => {
              // Get the protocol of the claim function
              const protocol = item?.address?.protocol;

              return (
                <ProtocolsProvider protocols={protocol ? [protocol] : []}>
                  <div className="flex flex-row items-center gap-2">
                    <WrappedImage
                      src={protocol?.logo}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                    <WrappedText className="tablet:hidden" fontSize={18}>
                      {protocol?.name}
                    </WrappedText>
                  </div>
                </ProtocolsProvider>
              );
            },
          },
          {
            label: "Position",
            callback: (item: YCFunc) => {
              // Get the dependency function (the original position)
              const dependency = item.dependencyFunction as YCFunc;

              return (
                <TokensBundle
                  tooltipEnabled={false}
                  tokens={dependency.outflows}
                  imageProps={{
                    width: 34,
                    height: 34,
                  }}
                  showTextIfSingle
                ></TokensBundle>
              );
            },
          },
          {
            label: "Claimable Rewards",
            callback: (item: YCFunc) => {
              return (
                <TokensBundle
                  tooltipEnabled={false}
                  tokens={item.inflows}
                  imageProps={{
                    width: 34,
                    height: 34,
                  }}
                  showTextIfSingle
                ></TokensBundle>
              );
            },
          },
          {
            label: "Choose",
            callback: (item: YCFunc) => {
              return (
                <RegulerButton
                  onClick={() => {
                    handleChoice(item);
                    closeModal?.();
                  }}
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    gap: "0.35rem",
                  }}
                  className="group transition duration-500 ease-in-out "
                >
                  <WrappedImage
                    src={{
                      dark: "/action-icons/harvest-light.svg",
                      light: "/action-icons/harvest-dark.svg",
                    }}
                  />
                  <WrappedText className="hidden group-hover:inline transition duration-1000 ease-in-out">
                    Choose
                  </WrappedText>
                </RegulerButton>
              );
            },
          },
        ]}
        items={claimFunctions}
        columnsGap="0px"
        rowsGap="25px"
        labelsStyle={{
          fontSize: 13,
        }}
        style={{
          justifyContent: "space-between",
          width: "100%",
        }}
      ></Table>
    </div>
  );
};
