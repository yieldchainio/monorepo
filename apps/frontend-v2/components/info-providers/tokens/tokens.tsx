/**
 * Utility wrapper around the ``<InfoProvider/>`` component for tokens
 */

import { Table } from "components/table";
import { InfoProvider } from "..";
import { TokensProviderProps } from "../types";
import { YCToken } from "@yc/yc-models";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { sliceAddress } from "utilities/general/slice-address";

export const TokensProvider = ({ children, tokens }: TokensProviderProps) => {
  return (
    <InfoProvider
      delay={500}
      style={{
        backgroundColor: "rgb(var(--bigcomponentbg), 1)",
      }}
      contents={
        <Table<YCToken>
          items={tokens}
          columnsGap="3rem"
          sections={[
            {
              label: (
                <WrappedText
                  fontSize={10}
                  className={"text-opacity-30 mx-auto"}
                >
                  {"Symbol"}
                </WrappedText>
              ),
              callback: (token: YCToken, i: number) => (
                <div className="flex flex-row gap-4" key={i}>
                  <WrappedImage
                    src={token.logo}
                    width={20}
                    height={18}
                    className="rounded-full translateY-[-100%]"
                  ></WrappedImage>
                  <WrappedText fontSize={12}>{token.symbol}</WrappedText>
                </div>
              ),
            },
            {
              label: "Address",
              callback: (token: YCToken, i: number) => (
                <WrappedText
                  fontSize={12}
                  className="text-opacity-100 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full "
                  key={i}
                >
                  {sliceAddress(token.address)}
                </WrappedText>
              ),
            },
            {
              label: "Network",
              callback: (token: YCToken, i: number) => (
                <WrappedText
                  fontSize={12}
                  className="text-opacity-100 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full "
                  key={i}
                >
                  {token.network?.name}
                </WrappedText>
              ),
            },
          ]}
        ></Table>
      }
    >
      {children}
    </InfoProvider>
  );
};
