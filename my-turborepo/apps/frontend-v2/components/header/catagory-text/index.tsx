"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "twind/shim";

export interface HeaderCatagoryTextProps {
  text: string;
  page: string;
}

// Enum for the text styles for this component
enum CatagoryTextStyles {
  OFF = "text-custom-off font-reguler",
  HOVER = "text-custom-offhover font-medium",
  ON = "text-transparent bg-gradient-to-r bg-clip-text from-custom-yclb to-custom-ycy font-bold",
}

/**
 * @notice
 * A text component for a catagory's text in the header
 * @param text - The name of the catagory, the text to display.
 * @param page - The page of this catagory
 * @returns A text that when clicked, routes to the path.
 */
export const HeaderCatagoryText = ({ text, page }: HeaderCatagoryTextProps) => {
  // The name of the current path
  const pathname = usePathname();

  // A state that decides on the styling of the text. If the current pathname is the path
  // of our catagory, the text is bold and gradient. Else it is off-gray
  const [style, setStyle] = useState<CatagoryTextStyles>(
    pathname === page ? CatagoryTextStyles.ON : CatagoryTextStyles.OFF
  );

  // Update the state each time the path changes
  useEffect(() => {
    pathname === page
      ? setStyle(CatagoryTextStyles.ON)
      : setStyle(CatagoryTextStyles.OFF);
  }, [pathname]);

  // Return the text
  return (
    <Link href={page}>
      {pathname == page ? (
        <motion.div
          style={{
            fontFamily: "Athletics",
          }}
          className={`font-athletics text-transparent bg-gradient-to-r bg-clip-text from-custom-yclb to-custom-ycy font-bold whitespace-nowrap cursor-pointer z-100`}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            pathname == page ? e.preventDefault() : null
          }
          whileHover={{
            scale: 1.01,
          }}
        >
          {text}
        </motion.div>
      ) : (
        <motion.div
          style={{
            fontFamily: "Athletics",
            color: "--off",
          }}
          className={`font-athletics ${style} whitespace-nowrap cursor-pointer z-100 hover:text-custom-offhover`}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            pathname == page ? e.preventDefault() : null
          }
          whileHover={{
            scale: 1.01,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          {text}
        </motion.div>
      )}
    </Link>
  );
};
