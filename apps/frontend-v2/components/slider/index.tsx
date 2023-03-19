/**
 * A Range Slider allowing the user to choose a minimum and
 * maximum values
 */
import { ChangeEvent, useState } from "react";

// Props
export interface RangeSliderProps {
  range: [number, number];
  className?: string;
  onChange?: (min: number, max: number) => any;
  width: number;
}

// The component
export const RangeSlider = ({
  range,
  className,
  onChange,
  width,
}: RangeSliderProps) => {
  const [minVal, setMinVal] = useState<number>(range[0]);
  const [max, setMaxVal] = useState<number>(range[1]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    if (type === "min") setMinVal(parseInt(e.target.value));
    if (type === "max") setMaxVal(parseInt(e.target.value));
  };
  return (
    <>
      <div className=" bg-blue-900 top-[500px] relative left-[200px] w-[400px] ">
        {/* <input
          type="range"
          min="0"
          max="1000"
          className="bg-red-500 text-red-900 absolute w-full apperance-none z-100"
          onChange={(e) => changeHandler(e, "min")}
        /> */}
        <input
          type="range"
          min="0"
          max="1000"
          className="transform rotate-180 w-full absolute  apperance-none z-200 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[50px] [&::-webkit-slider-thumb]:w-[50px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
          onChange={(e) => changeHandler(e, "max")}
        />
      </div>
      <div className="bg-blue-900 w-max">
        <div className="slider__track" />
        <div className="slider__range" />
      </div>
    </>
  );
};
