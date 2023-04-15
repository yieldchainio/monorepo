/**
 * A wrapper for the container of a strategy config,
 * mostly used for animation purposes.
 */

import { BaseComponentProps } from "components/types";

export const StrategyConfigWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="animate-configSlide">{children}</div>;
};

export const StrategyConfigVerticalWrapper = ({
  children,
  style,
}: BaseComponentProps) => {
  return (
    <div className=" animate-[modal_0.5s_ease-in-out]" style={style}>
      {children}
    </div>
  );
};
