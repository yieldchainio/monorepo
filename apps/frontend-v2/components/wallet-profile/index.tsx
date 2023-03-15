/**
 * @notice
 * A modal component for the user's profile w web3 functionality
 */
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
