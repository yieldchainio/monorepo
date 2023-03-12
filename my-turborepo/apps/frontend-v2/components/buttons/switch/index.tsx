/**
 * A custom switch component
 */

import { useState } from "react";
import { motion } from "framer-motion";
import "twind/shim";

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
      className="flex w-[100px] h-[43.2px] rounded-full border-testColor border-2 bg-[#383838] bg-opacity-[10%] drop-shadow-sm py-1 px-1.5 cursor-pointer"
      onClick={() => handleClick()}
      style={{
        justifyContent: on ? "end" : "start",
      }}
    >
      <motion.div
        className="w-[38.5%] h-full bg-red-900 rounded-full hover:scale-[1.01]"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
          duration: 1000,
        }}
      ></motion.div>
    </div>
  );
};
