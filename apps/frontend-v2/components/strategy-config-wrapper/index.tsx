/**
 * A wrapper for the container of a strategy config,
 * mostly used for animation purposes.
 */

export const StrategyConfigWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="animate-configSlide">{children}</div>;
};
