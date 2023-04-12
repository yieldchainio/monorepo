import { BaseComponentProps } from "components/types";
import { useEffect, useState } from "react";

const TIMEOUT_DURATION = 80; // Just looked like best balance of silky smooth and stop delaying me.

// Wrap this around any views and they'll fade in and out when mounting /
// unmounting.  I tried using <ReactCSSTransitionGroup> and <Transition> but I
// could not get them to work.  There is one major limitation to this approach:
// If a component that's mounted inside of <Fade> has direct prop changes,
// <Fade> will think that it's a new component and unmount/mount it.  This
// means the inner component will fade out and fade in, and things like cursor
// position in forms will be reset. The solution to this is to abstract <Fade>
// into a wrapper component.

export const Animate = ({
  children,
  initialClassname,
  endClassname,
}: BaseComponentProps & { initialClassname: string; endClassname: string }) => {
  const [className, setClassName] = useState<string>(initialClassname);
  const [newChildren, setNewChildren] = useState<React.ReactNode>(children);

  const effectDependency = Array.isArray(children) ? children : [children];

  useEffect(() => {
    setClassName("animate-modal");
    const timerId = setTimeout(() => {
      setClassName("fade show");
      setNewChildren(children);
    }, TIMEOUT_DURATION);

    return () => {
      clearTimeout(timerId);
    };
  }, effectDependency);

  return <div className={className}>{newChildren}</div>;
};
