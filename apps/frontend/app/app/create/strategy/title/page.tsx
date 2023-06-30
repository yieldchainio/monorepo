"use client";
import WrappedText from "components/wrappers/text";
/**
 * Title config for the strategy
 */

import { ConfigTitle } from "components/strategy-config-title";
import WrappedInput from "components/wrappers/input";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useEffect, useState } from "react";
import useDebounce from "utilities/hooks/general/useDebounce";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { StrategyConfigWrapper } from "components/strategy-config-wrapper";
import { useStateEffect } from "utilities/hooks/general/useStateEffect";

function TitleConfig() {
  // Title setter for current strategy config
  const setTitle = useStrategyStore((state) => state.setTitle);

  // Current title (Init to this)
  const globalTitle = useStrategyStore((state) => state.title);

  // The onChange'ed value
  const [input, setInput] = useStateEffect<string | null>(
    globalTitle,
    (title: string | null) => typeof title === "string" && setTitle(title)
  );

  // Set the colors
  useBackdropColorChange("#2aa", "#16a");

  return (
    <div className="flex flex-col items-center justify-between  w-[50%] h-[35%] mt-[15vh] mb-[20vh] gap-6">
      <ConfigTitle>
        {"Let's Get Started 👋"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          Give your strategy an epic title to get started
        </WrappedText>{" "}
      </ConfigTitle>

      <StrategyConfigWrapper>
        <WrappedInput
          type="text"
          className=""
          showGlass={false}
          placeholder='e.g: "Non-dev did smth" '
          onChange={(e) => setInput(e.target.value)}
          width="w-[100%]"
          title="Strategy Title"
          defaultValue={globalTitle || undefined}
          style={{
            paddingRight: "12vw",
          }}
        ></WrappedInput>
      </StrategyConfigWrapper>
    </div>
  );
}

export default TitleConfig;
