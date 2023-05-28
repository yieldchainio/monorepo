/**
 * The list of tokens
 */

import { YCToken } from "@yc/yc-models";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useState } from "react";

("border-custom-border");
export const TokensList = ({
  tokens,
  handler,
}: {
  tokens: YCToken[];
  handler: (token: YCToken) => void;
}) => {
  // Keep track of chosen token for styling purpuses
  const [chosenToken, setChosenToken] = useState<YCToken>();

  return (
    <div className=" w-full h-[100%] overflow-scroll scrollbar-hide  gap-0 divide-y-[1px] divide-custom-themedBorder  ">
      {tokens.map((token: YCToken, i: number) => {
        return (
          <TokenRow
            token={token}
            key={i}
            onClick={() => {
              handler(token);
              setChosenToken(token);
            }}
            chosen={chosenToken?.id === token.id}
          />
        );
      })}
    </div>
  );
};

/**
 * The single token row
 */

const TokenRow = ({
  token,
  chosen,
  onClick,
}: {
  token: YCToken;
  onClick: () => void;
  chosen: boolean;
}) => {
  return (
    <div className="w-full" onClick={onClick}>
      <div
        className={
          " rounded-xl flex flex-row w-full py-4 px-2 items-center justify-start gap-3 bg-custom-textColor bg-opacity-0 hover:bg-opacity-10 transition duration-200 ease-in-out cursor-pointer flex-grow-1 flex-bassis-0 border-[1px] border-transparent " +
          " " +
          (chosen ? "border-custom-off border-opacity-30" : "")
        }
      >
        <WrappedImage
          src={token.logo}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col items-start">
          <WrappedText fontSize={14}>{token.symbol}</WrappedText>
          <WrappedText fontSize={10} className="text-opacity-50">
            {token.name}
          </WrappedText>
        </div>
      </div>
    </div>
  );
};
