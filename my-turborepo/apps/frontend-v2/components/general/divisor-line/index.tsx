interface DivisorProps {
  className?: string;
}
const Divisor = ({ className }: DivisorProps) => {
  return (
    <div
      className={
        "w-[95%] h-0 border-[0.1px] border-custom-border my-6" +
        (className || "")
      }
    ></div>
  );
};

export default Divisor;
