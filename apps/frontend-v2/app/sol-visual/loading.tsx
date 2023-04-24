"use client";
/**
 * Return this loading page whilst populating the data
 */

import SmallLoader from "components/loaders/small";
import WrappedText from "components/wrappers/text";

const Loading = () => {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden flex flex-col gap-16 items-center justify-center">
      <SmallLoader
        color="currentColor"
        className="text-custom-textColor scale-[4]"
      ></SmallLoader>
      <WrappedText fontSize={28} fontStyle="bold">
        Getting Solana Transaction Details...
      </WrappedText>
    </div>
  );
};

export default Loading;
