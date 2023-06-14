"use client";
/**
 * @notice
 * A modal component for the user's profile w web3 functionality
 */
import React from "react";
import useYCUser from "utilities/hooks/yc/useYCUser";
import ProfileSection from "./profile";
import ProfileStats from "./stats";

export function ProfileModal({ ...props }) {
  const { address, userName, profilePic, createdVaults, updateDetails } =
    useYCUser();

  return (
    <div
      className="fixed w-[400px] h-max bg-custom-bcomponentbg top-[80px] translate-x-[-100px] flex flex-col rounded-3xl border-custom-themedBorder border-2 bg-opacity-100 py-10 px-5 gap-3 animate-accountPopup backdrop-blur-xl "
      {...props}
    >
      <ProfileSection
        address={address}
        userName={userName}
        profilePic={profilePic}
        createdVaults={createdVaults}
        updateDetails={updateDetails}
      />
      <ProfileStats createdVaults={createdVaults.length || 0} />
    </div>
  );
}
