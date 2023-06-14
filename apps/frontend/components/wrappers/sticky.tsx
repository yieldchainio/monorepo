import { useEffect, useRef, useState } from "react";

type heightToFix = number | { viewportHeight: number };
interface StickyProps {
  heightToFix: heightToFix;
  children: React.ReactNode;
  className?: string;
}
export function Sticky({ heightToFix, children, className }: StickyProps) {
  // Tracking the position as a state
  const [position, setPosition] = useState<"fixed" | "">();

  // Ref for the child, so we can append a transparent placeholder of the same size
  const childrenRef = useRef<HTMLDivElement>(null);

  // Size for it (sets once on mount)
  const [placeholderSize, setPlaceholderSize] = useState<{
    width: number;
    height: number;
  }>();

  // Set the dimensions on mount
  useEffect(() => {
    if (childrenRef.current)
      setPlaceholderSize(childrenRef.current.getBoundingClientRect());
  }, [childrenRef.current]);

  // useEffect listening for scrolls
  useEffect(() => {
    function onScroll() {
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
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {position === "fixed" && (
        <div
          style={{
            width: placeholderSize?.width,
            height: placeholderSize?.height,
          }}
        ></div>
      )}
      <div ref={childrenRef} className={className + " " + position}>
        {children}
      </div>
    </>
  );
}
