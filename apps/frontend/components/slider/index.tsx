/**
 * A Range Slider allowing the user to choose a minimum and
 * maximum values
 */
import Slider from "rc-slider";
import { useState } from "react";
import "rc-slider/assets/index.css";
import WrappedText from "components/wrappers/text";
import { formatMoney } from "utilities/general/format-money";

// Props
interface RangeSliderProps {
  range: [number, number];
  defaultValues?: [number, number];
  onChange?: (arg: number[]) => any;
}

// The component
export const RangeSlider = ({
  range,
  defaultValues = range,
  onChange,
}: RangeSliderProps) => {
  const [minVal, setMinVal] = useState<number>(defaultValues[0]);
  const [maxVal, setMaxVal] = useState<number>(defaultValues[1]);

  function changeHandler(_range: number[] | number) {
    if (typeof _range == "number") return;
    setMinVal(_range[0]);
    setMaxVal(_range[1]);
    onChange && onChange(_range);
  }

  return (
    <div className="flex flex-col items-end w-full">
      <Slider
        range
        trackStyle={{
          backgroundColor: "var(--lightcomponent)",
        }}
        railStyle={{
          backgroundColor: "var(--componentbg)",
        }}
        handleStyle={{
          backgroundColor: "var(--componentbg)",
          borderColor: "var(--border)",
        }}
        min={range[0]}
        max={range[1]}
        defaultValue={defaultValues}
        onChange={changeHandler}
        style={{
          width: "full",
        }}
      />
      <div className="flex flex-row justify-between items-center w-full">
        <WrappedText fontSize={12} fontStyle={"reguler"}>
          {"Min: " + formatMoney(minVal) + " "}
        </WrappedText>
        <WrappedText fontSize={12} fontStyle={"reguler"}>
          {"Max: " + formatMoney(maxVal) + " "}
        </WrappedText>
      </div>
    </div>
  );
};
