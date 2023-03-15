"use client";
import { useDisconnect } from "wagmi";
import useYCUser, { YCUserHookReturn } from "utilities/hooks/yc/useYCUser";
import WrappedImage from "components/wrappers/image";
import Icon from "components/icons/camera";
import WrappedText from "components/wrappers/text";
import { RegulerButton } from "components/buttons/reguler";
import DisconnectIcon from "components/icons/disconnect";

/**
 * Sub component of the profile for the modal
 */
const ProfileSection = ({
  address,
  userName,
  profilePic,
}: YCUserHookReturn) => {
  // Disconnect button
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-row w-full h-[20%]">
      <div className="flex gap-3.5 items-start justify-start">
        <div className="flex flex-col">
          <WrappedImage
            src={profilePic || "/profile-examples.svg"}
            width={59}
            height={59}
            className="rounded-full"
          />
          <Icon
            className="mx-[32px] my-[10%] cursor-pointer hover:scale-[1.05] transition duration-200 ease-in-out absolute"
            iconClassname="fill-current text-custom-lightcomponent hover:text-custom-lightHover transition duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-0 py-1">
          <WrappedText fontSize={22} fontStyle="light">
            {userName}
          </WrappedText>
          <div className="flex flex-row gap-2 items-center">
            <WrappedText fontSize={13} fontStyle="light" className="opacity-30">
              {address
                ? address?.slice(0, 4) +
                  "..." +
                  address?.slice(address.length - 4, address.length)
                : undefined}
            </WrappedText>
            <WrappedImage
              src={"/icons/copy.svg"}
              width={12}
              height={12}
              className="cursor-pointer hover:scale-110 transition duration-200 ease-in-out opacity-80"
              onClick={() => navigator.clipboard.writeText(address || "")}
            ></WrappedImage>
          </div>
        </div>
      </div>
      <RegulerButton
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          disconnect()
        }
        className="py-[8px] px-[10px] ml-auto items-center justify-center my-1"
      >
        <DisconnectIcon iconClassname="text-custom-textColor scale-[1.2] pointer-events-none" />
      </RegulerButton>
    </div>
  );
};

export default ProfileSection;
