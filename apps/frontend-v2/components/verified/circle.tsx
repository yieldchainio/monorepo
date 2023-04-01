/**
 * Small, circled verified tag
 */

import { InfoProvider } from "components/info-provider";
import { ToolTipDirection } from "components/info-provider/types";
import WrappedImage from "components/wrappers/image";

export const SmallVerified = () => {
  return (
    <InfoProvider contents={["Verified"]} direction={ToolTipDirection.RIGHT}>
      <div className="relative bg-red-500 left-[43%]">
        <div className="bg-custom-componentbg w-[20px] h-[20px] rounded-full bg-opacity-90 backdrop-blur-3xl absolute left-[90%] top-[-0.1rem] flex justify-center items-center flex-row pl-[0.8px]">
          <WrappedImage src="/icons/verified.svg" width={13} height={13} />
        </div>
      </div>
    </InfoProvider>
  );
};
