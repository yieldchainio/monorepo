/**
 * Represented basket of assets for perp basket LPing
 */

import { TokensBundle } from "components/tokens/bundle";
import { TokensBundleProps } from "components/tokens/bundle/types";
import WrappedText from "components/wrappers/text";

export const RepresentedTokens = ({
  tokens,
  style,
  className,
  imageProps,
  margin,
  label = "Represented Tokens:",
  fontSize = 13,
}: TokensBundleProps & { fontSize?: number; label?: string }) => {
  return (
    <div
      className={
        "flex flex-row items-center justify-between w-full" +
        " " +
        (className || "")
      }
      style={style}
    >
      <WrappedText fontSize={fontSize}>{label}</WrappedText>
      <TokensBundle
        tokens={tokens}
        maxImages={5}
        tooltipEnabled={true}
        imageProps={imageProps}
        margin={margin}
      />
    </div>
  );
};
