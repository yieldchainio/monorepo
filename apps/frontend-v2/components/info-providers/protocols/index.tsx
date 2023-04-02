/***
 * A utility wrapper of the ``<InfoProvider/>`` tooltip to provide
 * details about different kind of integrated protocols in a table-like manner
 */

import { Table } from "components/table";
import { InfoProvider } from "..";
import { ProtocolsProviderProps } from "../types";
import { YCProtocol } from "@yc/yc-models";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";

export const ProtocolsProvider = ({
  children,
  protocols,
}: ProtocolsProviderProps) => {
  return (
    <InfoProvider
      contents={
        <Table<YCProtocol>
          items={protocols}
          sections={[
            {
              label: "Name",
              callback: (protocol: YCProtocol) => (
                <div className="flex flex-row gap-1">
                  <WrappedImage
                    src={protocol.logo}
                    width={20}
                    height={18}
                    className="rounded-full"
                  ></WrappedImage>
                  <WrappedText>{protocol.name}</WrappedText>
                </div>
              ),
            },
            {
              label: "Website",
              callback: (protocol: YCProtocol) => (
                <WrappedText
                  fontSize={12}
                  className="text-opacity-70 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full "
                >
                  {protocol.website}
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
