/**
 * A component for a bundle of token images,
 * lays them out with a maximum number of images, then adds a "+n" text.
 *
 * Wrapped in a ```<TokensProvider />``` tooltip
 *
 * @param tokens - Array of YCToken's
 *
 * @param maxImages - Optional, max number of token images before the "+n" text shows up
 * @default 2
 *
 * @param imageProps - Optional, props for the actual token image
 * @default 14px dimensions
 *
 *
 */

import WrappedImage from "components/wrappers/image";
import { TokensBundleProps } from "./types";
import WrappedText from "components/wrappers/text";
import { TokensProvider } from "components/info-providers/tokens/tokens";
import { useMemo } from "react";

export const TokensBundle = ({
  tokens,
  maxImages = 2,
  imageProps = { width: 20, height: 20 },
  children,
  margin,
  style,
  tooltipEnabled = true,
  textProps,
  showAdditionalText = true,
  showTextIfSingle = false,
}: TokensBundleProps) => {
  // Memoize the tokens
  const mappedTokens = useMemo(() => {
    return tokens.map((token, i) => {
      if (!token) return null;
      // We do not want to move it to the left with negative margin if it's the first one to not mess up the container's flex
      if (i === 0)
        return (
          <div className="flex flex-row items-center">
            <WrappedImage
              src={token.logo}
              style={{
                borderRadius: `100%`,
                ...(imageProps.style || {}),
              }}
              width={imageProps.width}
              height={imageProps.height}
              className={"bg-custom-bg" + " " + (imageProps.className || "")}
              key={i}
            />
            {tokens.length === 1 && showTextIfSingle ? (
              <WrappedText className="ml-1 leading-none">
                {token.symbol}
              </WrappedText>
            ) : null}
          </div>
        );

      if (i < maxImages)
        return (
          <WrappedImage
            src={token.logo}
            style={{
              marginLeft: `-${margin || (imageProps.width || 0) / 2}px`,
              borderRadius: `100%`,
              ...(imageProps.style || {}),
            }}
            width={imageProps.width}
            height={imageProps.height}
            className={imageProps.className}
            key={i}
          />
        );
    });
  }, [tokens, tokens.length]);

  /**
   * Memo the component to return (With / Without <TokenProvider />)
   */
  const tokensComponent = useMemo(() => {
    if (tooltipEnabled)
      return (
        <TokensProvider tokens={tokens}>
          <div
            className="flex flex-row items-center justify-start"
            style={style}
          >
            {mappedTokens}
          </div>
        </TokensProvider>
      );

    return (
      <div className="flex flex-row items-center justify-start" style={style}>
        {mappedTokens}
      </div>
    );
  }, [tooltipEnabled, mappedTokens, mappedTokens.length]);

  return (
    <div className="flex flex-row items-center justify-start gap-0.5">
      {children}
      {tokensComponent}
      {tokens.length > maxImages && showAdditionalText ? (
        <WrappedText fontSize={12} fontStyle="bold" {...textProps}>
          {" " + "+" + (tokens.length - maxImages).toString()}
        </WrappedText>
      ) : null}
    </div>
  );
};
