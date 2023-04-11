"use client";
/**
 * Network config for the strategy
 */

import WrappedText from "components/wrappers/text";
import { ConfigTitle } from "../_components/title";

const TokenConfig = () => {
  return (
    <div className="flex flex-col items-center justify-between  w-[50%] h-[70%]">
      <ConfigTitle>
        {"Pick A Deposit Token 🍪"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The token that you & others will deposit into the vault
        </WrappedText>{" "}
      </ConfigTitle>
    </div>
  );
};

export default TokenConfig;
