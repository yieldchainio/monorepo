interface DivisorProps {
  className?: string;
}
const Divisor = ({ className }: DivisorProps) => {
  return (
    <div
      className={
        "w-[95%] h-0 border-[0.1px] border-custom-themedBorder my-6" +
        (className || "")
      }
    ></div>
  );
};

export default Divisor;
