"use client";
import { CloseButton } from "components/buttons/close";
import { UpgradeTierModal } from "components/modals/upgrade";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useEffect, useState } from "react";
import { useModals } from "utilities/hooks/stores/modal";

export const PepeAd = () => {
  const modals = useModals();

  const [shouldShow, setShouldShow] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("HIDE_PREMIUM_PEPE")) setShouldShow(true);
  }, [localStorage.getItem("HIDE_PREMIUM_PEPE")]);

  if (shouldShow)
    return (
      <div
        className="fixed top-[100%] translate-y-[-150%] translate-x-[50%] z-10000000 group shadow-blue-500"
        onClick={() => {
          modals.lazyPush(<UpgradeTierModal />);
        }}
      >
        <div className="relative group-hover:scale-[1.025] transition duration-200 ease-in-out">
          <CloseButton
            className="left-[0px] top-[0px] translate-x-[-75%] translate-y-[-50%]"
            onClick={(e) => {
              e?.stopPropagation();
              setShouldShow(false);
              localStorage.setItem("HIDE_PREMIUM_PEPE", "true");
            }}
            style={{
              left: "0px",
              top: "0px",
              transform: "translate(-100%, 50%)",
            }}
          />

          <div className="absolute p-1 rounded-md bg-custom-componentbg border-1 border-custom-border  left-[100%]  top-[50%] translate-y-[-50%] translate-x-[-5%] cursor-pointer group-hover:shadow-md  shadow-blue-500 transition duration-200 ease-in-out ">
            <WrappedText className="" fontSize={14}>
              💎 Get Premium For $49.99 /mo 💎
            </WrappedText>
          </div>
          <div className="flex flex-col items-center justify-center  border-2 border-custom-border rounded-full bg-custom-bcomponentbg overflow-x-hidden w-[100px] h-[100px] pt-4 pr-4 cursor-pointer group-hover:shadow-md  shadow-blue-500 transition duration-200 ease-in-out ">
            <WrappedImage
              src={"/icons/sexy-pepe.png"}
              height={100}
              width={100}
              className=""
            />
          </div>
        </div>
      </div>
    );

  return null;
};
