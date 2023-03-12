/**
 * A custom switch component
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "twind/shim";
import WrappedImage from "components/wrappers/image";

export interface SwitchProps {
  // A handler function for handling the switch turn on/off
  handler: (on: boolean) => any;
  // Optional styling
  className?: string;
  // Optional images to put on the switch circle
  images?: SwitchImages;
}

interface SwitchImages {
  onImage?: string;
  offImage?: string;
}

export const Switch = ({ handler, className, images }: SwitchProps) => {
  // Keep track of whether the button is on or off, change switch location based on that
  const [on, setOn] = useState<boolean>(false);

  // Handle click - set on/off and use the handler
  const handleClick = () => {
    handler(!on);
    setOn(!on);
  };
  return (
    <div
      className="flex w-[70px] h-[36.2px] rounded-full border-custom-border border-2 bg-custom-bg bg-opacity-[10%] drop-shadow-sm py-1 px-1.5 cursor-pointer"
      onClick={() => handleClick()}
      style={{
        justifyContent: on ? "end" : "start",
      }}
    >
      <motion.div
        className="flex items-center justify-center w-[42.5%] h-full bg-custom-componentbg rounded-full hover:scale-[1.01] border-2 border-custom-themedBorder"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
          duration: 1000,
        }}
      >
        {!on && images?.offImage && (
          <WrappedImage alt="" src={images.offImage} width={16} height={16} />
        )}
        {on && images?.onImage && (
          <WrappedImage alt="" src={images.onImage} width={18} height={18} />
        )}
      </motion.div>
    </div>
  );
};
