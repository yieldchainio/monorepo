import WrappedText from "components/wrappers/text";
import { PREMIUM_BENEFITS } from "../constants";
import WrappedImage from "components/wrappers/image";

export const DetailsSection = () => {
  const TitleText = () => {
    return (
      <div className="flex flex-col items-start justify-center gap-4  whitespace-pre-wrap h-full tablet:text-center tablet:items-center">
        <WrappedText
          fontStyle="bold"
          fontSize={34}
          className="whitespace-pre-wrap "
        >
          Take Your Experience To The Next Level
        </WrappedText>
        <WrappedText className="text-opacity-80">
          Unlock premium features at an affordable price.
        </WrappedText>
      </div>
    );
  };

  const Benefits = () => {
    return (
      <div className="w-full h-full flex flex-row flex-wrap gap-4 items-center">
        {PREMIUM_BENEFITS.map((benefit: string) => (
          <div className="flex flex-row gap-2">
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
      className="flex flex-col items-start justify-center gap-8 h-[100%] w-full mt-auto mb-auto "
      style={{
        height: "100%",
      }}
    >
      <TitleText />
      <Benefits />
    </div>
  );
};
