"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WrappedText, { Selection } from "components/wrappers/text";

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

  // Return the text
  return (
    <Link href={page}>
      {pathname == page ? (
        <WrappedText
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            pathname == page ? e.preventDefault() : null
          }
          text={text}
          fontSize={14}
          fontStyle={"bold"}
          fontFamily={"athletics"}
          fontColor={"transparent"}
          select={Selection.disallow}
          className={
            "bg-gradient-to-r bg-clip-text from-custom-yclb to-custom-ycy cursor-pointer z-100 hover:scale-[1.01] truncate"
          }
        />
      ) : (
        <WrappedText
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            pathname == page ? e.preventDefault() : null
          }
          text={text}
          fontSize={14}
          fontStyle={"reguler"}
          fontFamily={"athletics"}
          fontColor={"custom-off"}
          select={Selection.disallow}
          className={
            "cursor-pointer z-100 hover:text-custom-offhover transition duration-200 ease-in-out active:scale-[0.98] truncate"
          }
        />
      )}
    </Link>
  );
};
