/**
 * Represented basket of assets for perp basket LPing
 */

import { TokensBundle } from "components/tokens/bundle";
import { TokensBundleProps } from "components/tokens/bundle/types";
import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";

export const RepresentedTokensLpBasket = ({
  tokens,
  style,
  className,
  imageProps,
  margin,

  fontSize = 13,
}: TokensBundleProps & {fontSize?: number}) => {
  return (
    <div
      className={
        "flex flex-row items-center justify-between w-full" +
        " " +
        (className || "")
      }
      style={style}
    >
      <WrappedText fontSize={fontSize}>Represented Basket:</WrappedText>
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
