/**
 * A component for the gas throughput box of the strategy modal
 */

import { YCToken } from "@yc/yc-models";
import Divisor from "components/general/divisor-line";
import WrappedText from "components/wrappers/text";
import { useEffect, useMemo, useState } from "react";
import { InfoSection } from "../../general/info-section";
import { InterModalSection } from "../../general/modal-section";

export const GasThroughput = ({
  gasIn,
  gasOut,
  token,
}: {
  gasIn: bigint;
  gasOut: bigint;
  token?: YCToken | null;
}) => {
  const [gasInputted, setGasInputted] = useState<number | undefined>();
  const [gasOutputted, setGasOutputted] = useState<number | undefined>();
  const [netGas, setNetGas] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const quoteIn = await token?.quoteUSD(gasIn);
      const quoteOut = await token?.quoteUSD(gasOut);
      setGasInputted(quoteIn);
      setGasOutputted(quoteOut);
      setNetGas((quoteIn || 0) - (quoteOut || 0));
    })();
  }, [token?.id]);

  const netGasColor = useMemo(
    () => (netGas && netGas > 0 ? "text-green-500" : "text-red-500"),
    [netGas]
  );

  return (
    <InterModalSection
      height="h-[40%] flex-row items-center justify-between tablet:hidden "
      width={"w-[55%]"}
    >
      <InfoSection title="Gas In /run" className="smallLaptop:hidden">
        <WrappedText
          fontSize={18}
          fontColor={"green-500"}
          className="text-green-500"
        >
          {`+$0`}
        </WrappedText>
      </InfoSection>
      <Divisor
        className="rotate-90 w-[23%] border-custom-textColor smallLaptop:hidden "
        style={{
          borderColor: "rgba(var(--text), 0.1)",
          width: "18%",
        }}
      />
      <InfoSection title="Gas Out /run" className="smallLaptop:hidden">
        <WrappedText
          fontSize={18}
          fontColor={"green-500"}
          className="text-red-500"
        >
          {gasOutputted
            ? "-$" + gasOutputted?.toFixed(2).toString()
            : undefined}
        </WrappedText>
      </InfoSection>
      <InfoSection title="Net Gas /run" className="hidden smallLaptop:flex">
        <WrappedText fontSize={18} className={netGasColor}>
          {netGas
            ? (netGas > 0 ? "+$" : "-$") +
              (netGas < 0
                ? parseFloat(netGas.toString().split("-")[1])
                : netGas
              )
                .toFixed(2)
                .toString()
            : undefined}
        </WrappedText>
      </InfoSection>
    </InterModalSection>
  );
};
