/**
 * @notice
 * A modal component for the user's profile w web3 functionality
 */
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import Icon from "components/icons/camera";
import { RegulerButton } from "components/buttons/reguler";
import DisconnectIcon from "components/icons/disconnect";
import { useRouter } from "next/navigation";
import LinkIcon from "components/icons/link";
import Divisor from "components/general/divisor-line";
import React from "react";
import { useDisconnect } from "wagmi";
import useYCUser from "utilities/hooks/yc/useYCUser";
import ProfileSection from "./profile";
import ProfileStats from "./stats";

export const ProfileModal = () => {
  const { disconnect } = useDisconnect();
  const { address, userName, profilePic } = useYCUser();

  return (
    <div className="fixed w-[400px] h-max bg-custom-bcomponentbg top-[80px] translate-x-[-100px] flex flex-col rounded-3xl border-custom-border border-2 bg-opacity-95 py-10 px-5 gap-3">
      <ProfileSection
        address={address}
        userName={userName}
        profilePic={profilePic}
      />
      <ProfileStats />
    </div>
  );
};
