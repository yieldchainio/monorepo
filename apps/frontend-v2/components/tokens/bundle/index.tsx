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

export const TokensBundle = ({
  tokens,
  maxImages = 2,
  imageProps = { width: 20, height: 20 },
  children,
}: TokensBundleProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-0.5">
      {children}
      <TokensProvider tokens={tokens}>
        <div className="flex flex-row items-center justify-start">
          {tokens.map((token, i) => {
            console.log("Mapping token");
            if (!token) return null;
            // We do not want to move it to the left with negative margin if it's the first one to not mess up the container's flex
            if (i === 0)
              return (
                <WrappedImage
                  src={token.logo}
                  style={{
                    borderRadius: `100%`,
                    ...(imageProps.style || {}),
                  }}
                  width={imageProps.width}
                  height={imageProps.height}
                  className={imageProps.className}
                  key={i}
                />
              );

            if (i < maxImages)
              return (
                <WrappedImage
                  src={token.logo}
                  style={{
                    marginLeft: `-${imageProps.width / 2}px`,
                    borderRadius: `100%`,
                    ...(imageProps.style || {}),
                  }}
                  width={imageProps.width}
                  height={imageProps.height}
                  className={imageProps.className}
                  key={i}
                />
              );
          })}
        </div>
      </TokensProvider>
      {tokens.length > maxImages && (
        <WrappedText fontSize={12} fontStyle="bold">
          {" " + "+" + (tokens.length - maxImages).toString()}
        </WrappedText>
      )}
    </div>
  );
};
