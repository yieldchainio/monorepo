/**
 * Utility wrapper for the TokenBundle for steps, where the tokens show up as an inflow or an outflow
 */

import WrappedText from "components/wrappers/text";
import { TokensBundle } from "..";
import { TokensBundleProps } from "../types";

const borderWidth = "1px";
const moreTokensFontSize = 18;

// The wrapper for inflowing tokens
export const InflowTokenBundle = ({
  tokens,
  maxImages = 2,
  imageProps = { width: 18, height: 18 },
  portal,
}: TokensBundleProps) => {
  return (
    <TokensBundle
      tokens={tokens}
      maxImages={maxImages}
      imageProps={{
        ...imageProps,
        style: {
          borderWidth: `1px`,
        },
        className: "border-green-500",
      }}
      portal={portal}
    >
      <WrappedText
        fontSize={15}
        className="font-outline-2"
        fontColor="green-500"
      >
        +
      </WrappedText>
    </TokensBundle>
  );
};

// The wrapper for outflowing tokens
export const OutflowTokenBundle = ({
  tokens,
  maxImages = 2,
  imageProps = { width: 18, height: 18 },
  portal,
}: TokensBundleProps) => {
  return (
    <TokensBundle
      tokens={tokens}
      maxImages={maxImages}
      imageProps={{
        ...imageProps,
        style: {
          borderWidth: `1px`,
        },
        className: "border-red-500",
      }}
      portal={portal}
    >
      <WrappedText fontSize={15} className="font-outline-2" fontColor="red-500">
        -
      </WrappedText>
    </TokensBundle>
  );
};
