/**
 * Component to showcase and accept a token amount input,
 * display balance and so on
 */

import { YCToken } from "@yc/yc-models";
import { InfoProvider } from "components/info-providers";
import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { constants } from "ethers";
import { ChangeEvent, useMemo, useState } from "react";
import useDebounce from "utilities/hooks/general/useDebounce";
import { useBalance } from "wagmi";

export const TokenInput = <T extends `${number}` | number>({
  token,
  address,
  onChange,
  value,
  className,
}: BaseComponentProps & {
  token?: YCToken;
  address?: string;
  onChange: (newValue: `${number}`) => void;
  value?: T;
}) => {
  const balance = useBalance({
    address: address as `0x${string}`,
    token:
      token?.address == constants.AddressZero
        ? undefined
        : (token?.address as `0x${string}`),
  });

  const balanceText = useMemo(() => {
    if (balance?.data?.formatted)
      return parseFloat(balance.data.formatted).toFixed(7);
    if (balance?.isLoading) return "Loading...";
    if (balance?.isError) return "Failed To Fetch";
  }, [balance?.data?.formatted, balance?.isError, balance?.isLoading]);

  return (
    <div className={"flex flex-col gap-2  w-full" + " " + (className || "")}>
      <div className="w-[80%] h-max flex flex-col justify-start items-start">
        <div className="flex flex-row items-center justify-between w-[95%]">
          <WrappedText
            className="text-opacity-50 w-max tablet:hidden"
            fontSize={12}
          >
            {"Amount"}
          </WrappedText>
          <InfoProvider contents="Use Max Balance">
            <WrappedText
              className="text-opacity-50 w-max cursor-pointer"
              fontSize={12}
              onClick={() => {
                balanceText ? onChange(balanceText as `${number}`) : null;
              }}
            >
              {"Balance: " + balanceText}
            </WrappedText>
          </InfoProvider>
        </div>

        <WrappedInput
          min={0.00001}
          icon={
            <div className="absolute pointer-events-none mr-6 flex flex-row gap-1 items-center justify-center bg-custom-bg rounded-xl pl-1">
              <WrappedImage
                src={token?.logo || undefined}
                width={18}
                height={18}
                className="rounded-full"
              />
              <WrappedText
                fontSize={11}
                fontStyle="bold"
                className=" mt-1  tablet:hidden "
              >
                {token?.symbol}
              </WrappedText>
            </div>
          }
          type={"number"}
          placeholder="0.00"
          className="w-max pr-[2vw]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value as `${number}`)
          }
          // value={`${value}`}
        ></WrappedInput>
      </div>
    </div>
  );
};
