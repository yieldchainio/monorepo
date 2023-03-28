"use client";
/**
 * The profile section of the strategy modal
 */

import { YCSocialMedia, YCUser } from "@yc/yc-models";
import { RegulerButton } from "components/buttons/reguler";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { ImageSrc } from "components/wrappers/types";
import useYCUser from "utilities/hooks/yc/useYCUser";

export const ProfileSection = ({ user }: { user?: YCUser | null }) => {
  // Get the user's details using the hook
  const { address, userName, profilePic, socialMedia, verified, description } =
    useYCUser({
      userAddress: user?.address as `0x${string}`,
    });

  return (
    <div className="flex flex-row gap-2 items-start justify-between w-[35%] h-[10%]  self-start truncate  ">
      <div className="flex flex-row gap-2 items-center justify-start w-[20%] h-full ">
        <WrappedImage
          src={profilePic}
          width={52}
          height={52}
          className="rounded-full"
        />
        <div className="flex flex-col gap-1 items-start justify-center w-[20%] h-max overflow-visible ">
          <WrappedText fontSize={28}>{userName}</WrappedText>
          <WrappedText fontSize={14} className="text-opacity-50 truncate">
            {(description || "") +
              (description || "") +
              (description || "") +
              (description || "") +
              (description || "")}
          </WrappedText>
        </div>
      </div>
      <SocialMediaSection socialMedia={socialMedia} />
    </div>
  );
};

const SocialMediaSection = ({
  socialMedia,
}: {
  socialMedia: YCSocialMedia;
}) => {
  return (
    <div className="flex flex-row gap-3 w-max h-max p-1 items-center mt-2">
      {socialMedia.twitter?.link && (
        <SocialMediaButton
          logo={{
            dark: "/icons/twitter-light.svg",
            light: "/icons/twitter-dark.svg",
          }}
          link={socialMedia.twitter.link}
        />
      )}
      {socialMedia.telegram?.link && (
        <SocialMediaButton
          logo={{
            dark: "/icons/telegram-light.svg",
            light: "/icons/telegram-dark.svg",
          }}
          link={socialMedia.telegram.link}
        />
      )}
      {socialMedia.discord?.link && (
        <SocialMediaButton
          logo={{
            dark: "/icons/discord-light.svg",
            light: "/icons/discord-dark.svg",
          }}
          link={socialMedia.discord.link}
        />
      )}
    </div>
  );
};

const SocialMediaButton = ({
  logo,
  link,
}: {
  logo: ImageSrc;
  link: string;
}) => {
  return (
    <RegulerButton
      onClick={() => window.open(link, "_blank", "noreferrer")}
      className=" pt-[0.25rem] pb-[0.25rem] pr-1 pl-1 rounded-full "
    >
      <WrappedImage src={logo} width={13} height={13} />
    </RegulerButton>
  );
};
