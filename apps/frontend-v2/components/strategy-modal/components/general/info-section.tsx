/**
 * An info section within a modal section of the strategy modal.
 *
 * i.e: TVL: xxxx
 */

import WrappedText from "components/wrappers/text";

export const InfoSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={
        "flex flex-col gap-1 smallMobile:items-center" + " " + (className || "")
      }
    >
      <WrappedText fontSize={13} className="text-opacity-30">
        {title}
      </WrappedText>
      {typeof children == "string" ? (
        <WrappedText fontSize={20}>{children}</WrappedText>
      ) : (
        children
      )}
    </div>
  );
};
