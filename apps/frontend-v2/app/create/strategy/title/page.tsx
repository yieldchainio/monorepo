"use client";
import WrappedText from "components/wrappers/text";
/**
 * Title config for the strategy
 */

import { ConfigTitle } from "../_components/title";
import WrappedInput from "components/wrappers/input";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useEffect, useState } from "react";
import useDebounce from "utilities/hooks/general/useDebounce";

const TitleConfig = () => {
  // Title setter for current strategy config
  const setTitle = useStrategyStore((state) => state.setTitle);

  // Current title (Init to this)
  const globalTitle = useStrategyStore((state) => state.title);

  // The onChange'ed value
  const [input, setInput] = useState<string | null>(globalTitle);

  // The debounced input (We dont wanna rerender globally all the time)
  const debouncedInput = useDebounce(
    input,
    500,
    (title) => title && setTitle(title)
  );

  return (
    <div className="flex flex-col items-center justify-between  w-[50%] h-[40%]">
      <ConfigTitle>
        {"Let's Get started 👋"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          Give your strategy an epic title to get started
        </WrappedText>{" "}
      </ConfigTitle>

      <WrappedInput
        type="text"
        className=""
        showGlass={false}
        placeholder='e.g: "Non-dev did smth" '
        onChange={(e) => setInput(e.target.value)}
        width="w-[100%]"
        title="Strategy Title"
        value={globalTitle || undefined}
      ></WrappedInput>
    </div>
  );
};

export default TitleConfig;
