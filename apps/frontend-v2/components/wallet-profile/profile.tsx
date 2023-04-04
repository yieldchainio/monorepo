"use client";
import { useDisconnect } from "wagmi";
import { YCUserHookReturn } from "utilities/hooks/yc/useYCUser";
import WrappedImage from "components/wrappers/image";
import Icon from "components/icons/camera";
import WrappedText from "components/wrappers/text";
import WrappedInput from "components/wrappers/input";
import { RegulerButton } from "components/buttons/reguler";
import DisconnectIcon from "components/icons/disconnect";
import { ThemeSwitch } from "components/switches/theme";
import EditIcon from "components/icons/edit";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import CheckmarkIcon from "components/icons/checkmark";
import SmallLoader from "components/loaders/small";

/**
 * Sub component of the profile for the modal
 */
const ProfileSection = ({
  address,
  userName,
  profilePic,
  updateDetails,
}: Partial<YCUserHookReturn>) => {
  // Disconnect button
  const { disconnect } = useDisconnect();

  // if the user wants to change their username, the value will be saved here
  const [newUsername, setNewUsername] = useState(userName);

  // Keeping track of whether the user is editing their username or not
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Whether updating details is loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle the new username choice
  const confirmNewUsername = async () => {
    setIsLoading(true);
    setIsEditing(false);
    updateDetails && (await updateDetails({ username: newUsername }));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row w-full h-[20%] gap-12">
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
        <div className="flex flex-col gap-1 py-1 items-start justify-center">
          <div className="flex flex-row gap-3 items-start">
            {isEditing ? (
              <div className="flex flex-row w-[100%] max-w-[130px] whitespace-nowrap items-center justify-between gap-2">
                <WrappedText
                  fontSize={22}
                  fontStyle="light"
                  className=" w-full border-[0.01px] border-transparent border-b-custom-textColor pr-[80px] text-clip"
                  contentEditable="true"
                  id="username_editor"
                  onInput={(e: FormEvent<HTMLDivElement>) =>
                    e.currentTarget.textContent &&
                    setNewUsername(e.currentTarget.textContent)
                  }
                  truncate="truncate"
                >
                  {userName}
                </WrappedText>
                <div className="ml-0" onClick={confirmNewUsername}>
                  <CheckmarkIcon
                    className="cursor-pointer hover:text-custom-lightHover transition duration-200 text-custom-textColor"
                    iconClassname=""
                  />
                </div>
              </div>
            ) : (
              <>
                <WrappedText
                  fontSize={22}
                  fontStyle="light"
                  className="overflow-hidden max-w-[100px] truncate"
                >
                  {userName}
                </WrappedText>
                <div onClick={() => setIsEditing(!isEditing)}>
                  {!isLoading ? (
                    <EditIcon
                      className="scale-[1.15] mt-1.5 cursor-pointer hover:scale-[1.2] transition duration-200 ease-in-out text-custom-textColor hover:text-custom-lightHover"
                      iconClassname=""
                    />
                  ) : (
                    <SmallLoader color="fill-[#ffffff]" />
                  )}
                </div>
              </>
            )}
          </div>
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
      <div className="flex flex-row items-center gap-2 pb-5 ml-auto">
        <ThemeSwitch />
        <RegulerButton
          onClick={(e?: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>
            disconnect()
          }
          className="py-[8px] px-[10px] ml-auto items-center justify-center my-1"
        >
          <DisconnectIcon iconClassname="text-custom-textColor scale-[1.2] pointer-events-none" />
        </RegulerButton>
      </div>
    </div>
  );
};

export default ProfileSection;
