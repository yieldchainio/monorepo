import { useEffect, useState } from "react";

type heightToFix = number | { viewportHeight: number };
interface StickyProps {
  heightToFix: heightToFix;
  children: React.ReactNode;
  className?: string;
}
export const Sticky = ({ heightToFix, children, className }: StickyProps) => {
  // Tracking the position as a state
  const [position, setPosition] = useState<"fixed" | "">();

  // useEffect listening for scrolls
  useEffect(() => {
    const onScroll = () => {
      if (typeof heightToFix === "object") {
        if (
          document &&
          document.documentElement.scrollTop >=
            window.innerHeight * (heightToFix.viewportHeight / 100)
        )
          setPosition("fixed");
        else setPosition("");
      }
      if (typeof heightToFix === "number") {
        if (document && document.documentElement.scrollTop >= heightToFix)
          setPosition("fixed");
        else setPosition("");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className={className + " " + position}>{children}</div>;
};
