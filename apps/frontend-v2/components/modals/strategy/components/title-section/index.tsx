/**
 * A component for the title's section in the strategy modal.
 *
 * Displays the token's logo, symbol, and the strategy name.
 */

import { TokenLogo } from "components/token-logo";
import WrappedText from "components/wrappers/text";

export const TitleSection = ({
  logo,
  symbol,
  title,
}: {
  logo: string | null | undefined;
  symbol: string | null | undefined;
  title: string | null | undefined;
}) => {
  return (
    <div className="w-full h-[8.5%] flex flex-row items-center justify-start gap-3">
      <TokenLogo src={logo} width={52} height={52} />
      <div className="flex flex-col justify-center">
        <WrappedText fontSize={26}>{symbol}</WrappedText>
        <WrappedText className="text-opacity-50" fontSize={14}>
          {title}
        </WrappedText>
      </div>
    </div>
  );
};
