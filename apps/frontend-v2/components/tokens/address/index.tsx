/**
 * A component for a token address link,
 *
 * @param token - YCToken
 * @param textProps - Props for the text itself
 *
 * Links the address to corresponding block explorer
 */

import WrappedText from "components/wrappers/text";
import { TokenAddressProps } from "./types";
import { InfoProvider } from "components/info-providers";
import Link from "next/link";
import { sliceAddress } from "utilities/general/slice-address";

export const TokenAddress = ({
  token,
  textProps = {
    fontSize: 12,
    className:
      "text-opacity-100 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full ",
  },
}: TokenAddressProps) => {
  return (
    <InfoProvider contents="View On Block Explorer">
      <div>
        <Link
          href={token.network?.blockExplorer + "/address" + `/${token.address}`}
          target="_blank"
        >
          <WrappedText {...textProps}>
            {sliceAddress(token.address)}
          </WrappedText>
        </Link>
      </div>
    </InfoProvider>
  );
};
