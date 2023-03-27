/**
 * A custom switch component
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WrappedImage from "components/wrappers/image";

interface SwitchProps {
  // A handler function for handling the switch turn on/off
  handler: (on: boolean) => any;
  // Optional styling
  className?: string;
  // Optional images to put on the switch circle
  images?: SwitchImages;
  // Optional overriding variable to decide the on/off states
  overridingState?: boolean;
}

interface SwitchImages {
  onImage?: string;
  offImage?: string;
}

export const Switch = ({
  handler,
  className,
  images,
  overridingState,
}: SwitchProps) => {
  // Keep track of whether the button is on or off, change switch location based on that
  const [on, setOn] = useState<boolean>(false);

  // useEffect listening to the (optional) overriding state and updating our state with it
  useEffect(() => {
    if (overridingState !== undefined) setOn(overridingState);
  }, [overridingState]);

  // Handle click - set on/off and use the handler
  const handleClick = () => {
    handler(!on);
    setOn(!on);
  };
  return (
    <div
      className="flex w-[60px] h-[28.2px] rounded-full border-custom-border border-[1px] bg-custom-bcomponentbg bg-opacity-[100%] drop-shadow-sm py-1 px-1.5 cursor-pointer hover:bg-custom-componentbg transition duration-200 ease-in-out"
      onClick={() => handleClick()}
      style={{
        justifyContent: on ? "end" : "start",
      }}
    >
      <motion.div
        className="flex items-center justify-center w-[40.5%] h-full bg-custom-componentbg rounded-full hover:scale-[1.01] border-[1px] border-custom-border drop-shadow-xl"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
          duration: 1000,
        }}
      >
        {!on && images?.offImage && (
          <WrappedImage alt="" src={images.offImage} width={12} height={12} />
        )}
        {on && images?.onImage && (
          <WrappedImage alt="" src={images.onImage} width={18} height={18} />
        )}
      </motion.div>
    </div>
  );
};
