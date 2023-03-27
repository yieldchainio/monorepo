"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WrappedText from "components/wrappers/text";
import { Selection, TextProps } from "components/wrappers/types";
import { RegulerButtonProps } from "components/buttons/reguler/types";

interface HeaderCatagoryTextProps
  extends RegulerButtonProps,
    Omit<Omit<TextProps, "children">, "onClick"> {
  text: string;
  page: string;
  fontSize?: number;
  fontColor?: string;
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
export const HeaderCatagoryText = ({
  text,
  page,
  className,
  onClick,
  fontSize,
  fontColor,
}: HeaderCatagoryTextProps) => {
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
          fontSize={fontSize || 16}
          fontStyle={"bold"}
          fontFamily={"athletics"}
          fontColor={fontColor || "transparent"}
          select={Selection.disallow}
          className={
            "bg-gradient-to-r bg-clip-text from-custom-yclb to-custom-ycy cursor-pointer z-100 hover:scale-[1.01] truncate " +
            className
          }
        >
          {text}
        </WrappedText>
      ) : (
        <WrappedText
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            pathname == page ? e.preventDefault() : null
          }
          fontSize={fontSize || 16}
          fontStyle={"reguler"}
          fontFamily={"athletics"}
          fontColor={fontColor || "custom-off"}
          select={Selection.disallow}
          className={
            "cursor-pointer z-100 hover:text-custom-offhover transition duration-200 ease-in-out active:scale-[0.98]"
          }
        >
          {text}
        </WrappedText>
      )}
    </Link>
  );
};
