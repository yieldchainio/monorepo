import WrappedText from "components/wrappers/text";
import { PREMIUM_BENEFITS } from "../constants";
import WrappedImage from "components/wrappers/image";
import { TileOptions } from "components/tile-options";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { YCClassifications } from "@yc/yc-models";
import { YCTier } from "@yc/yc-models/src/core/tier";

export const DetailsSection = ({
  chosenTier,
  setChosenTier,
  tiers,
}: {
  chosenTier: YCTier;
  setChosenTier: (tier: YCTier) => void;
  tiers: YCTier[];
}) => {
  const TitleText = () => {
    return (
      <div className="flex flex-col items-start justify-center gap-4  whitespace-pre-wrap h-full tablet:text-center tablet:items-center ">
        <WrappedText
          fontStyle="bold"
          fontSize={34}
          className="whitespace-pre-wrap  "
        >
          {chosenTier.title}
        </WrappedText>
        <WrappedText className="text-opacity-80">
          {chosenTier.description}
        </WrappedText>
      </div>
    );
  };

  const Benefits = () => {
    return (
      <div className="w-full h-full flex flex-row flex-wrap gap-4 items-center">
        {chosenTier.benefits?.map((benefit: string, i) => (
          <div className="flex flex-row gap-2" key={benefit + `${i}`}>
            <WrappedImage
              src="/icons/green-checkmark-full.svg"
              className="rounded-full"
              width={16}
              height={16}
            />
            <WrappedText fontSize={12}>{benefit}</WrappedText>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-start justify-center gap-8  w-full mt-auto mb-auto h-full"
      style={{
        height: "100%",
      }}
    >
      <div className="flex flex-col items-between justify-start gap-2">
        <WrappedText>Choose Tier:</WrappedText>
        <TileOptions
          options={tiers.map((tier) => {
            return {
              text: tier.name,
              data: tier,
            };
          })}
          handler={() => null}
          setChoice={(idx: number) => {
            setChosenTier(tiers[idx]);
          }}
        />
      </div>
      <TitleText />
      <Benefits />
    </div>
  );
};
