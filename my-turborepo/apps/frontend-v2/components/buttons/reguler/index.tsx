/**
 * A reguler button
 */

interface RegulerButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  className?: string;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}
export const RegulerButton = ({
  onClick,
  children,
  className,
}: RegulerButtonProps) => {
  return (
    <div
      className={
        "w-max overflow-hidden h-max bg-custom-dropdown bg-opacity-20 flex items-center justify-between border-[#47474B] border-[1px] rounded-xl py-3 px-4 select-none cursor-pointer hover:bg-opacity-70 hover:border-[#4F4F55] transition duration-200 ease-in-out font-athletics text-custom-textColor" +
        (" " + (className || ""))
      }
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClick(e)}
    >
      {children}
    </div>
  );
};
