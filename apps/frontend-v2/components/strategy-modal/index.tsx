/**
 * A modal for the strategies
 */
import { YCStrategy } from "@yc/yc-models";
import { ModalWrapperProps } from "components/modal-wrapper/types";
import { ModalWrapper } from "components/modal-wrapper";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import "../../css/globals.css";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { TokenLogo } from "components/token-logo";
import { InterModalSection } from "./components/general/modal-section";
import { TitleSection } from "./components/title-section";
import { ProfileSection } from "./components/profile-section";

/**
 * @param strategyID - The ID of the strategy to display
 */
interface StratregyModalProps extends Omit<ModalWrapperProps, "children"> {
  strategyID: string;
}

// The component
export const StrategyModal = ({
  strategyID,
  modalKey,
  closeFunction,
  callbackRoute = "/",
}: StratregyModalProps) => {
  // Keeping a state of the strategy
  const strategy = useYCStore((state) =>
    state.context.YCstrategies.find((strat) => strat.id === strategyID)
  );

  // Return the JSX
  return (
    <ModalWrapper
      modalKey={modalKey}
      callbackRoute={callbackRoute || "/"}
      closeFunction={closeFunction}
    >
      <div className=" w-[80vw] h-[200vh] bg-custom-bcomponentbg mt-8 rounded-lg flex flex-col items-center justify-start p-8 gap-6">
        <TitleSection
          logo={strategy?.depositToken?.logo}
          symbol={strategy?.depositToken?.symbol}
          title={strategy?.title}
        />
        <div className="w-full h-full flex flex-col items-center justify-start gap-3 max-w-[1100px] ">
          <InterModalSection height="h-[25%]" />
          <div className="flex flex-row w-full h-[40%] gap-3 items-end ">
            <div className="flex flex-col w-full h-full gap-3  ">
              <InterModalSection height="h-[55%]" />
              <InterModalSection height="h-[45%]" />
            </div>
            <InterModalSection height="h-[100%]" className="tablet:h-[45%]" />
            <InterModalSection height="h-[100%]" />
          </div>
          <ProfileSection user={strategy?.creator} />
        </div>
      </div>
    </ModalWrapper>
  );
};
