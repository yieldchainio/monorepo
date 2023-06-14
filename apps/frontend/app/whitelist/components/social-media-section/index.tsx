import { RegulerButton } from "components/buttons/reguler";
import Divisor from "components/general/divisor-line";
import { InfoProvider } from "components/info-providers";
import { BaseModalChildProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { ImageProps, ImageSrc } from "components/wrappers/types";
import { forwardRef, useMemo, useState } from "react";
import {
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useModals } from "utilities/hooks/stores/modal";
import useYCUser from "utilities/hooks/yc/useYCUser";

export function SocialMediasSection() {
  const {
    address,
    whitelisted,
    connected,
    socialMedia,
    updateDetails,
    userName,
  } = useYCUser();

  const isWhitelisted = useMemo(
    () => (address && connected ? whitelisted : null),
    [address, whitelisted]
  );

  const modals = useModals();

  return (
    <div className="flex flex-row items-center justify-between w-[90%] h-[65%] ">
      <div className="flex flex-row items-center justify-between gap-4 w-full  px-[10vw]">
        <div className="flex flex-col gap-1 items-center">
          <WrappedText
            fontStyle="bold"
            fontSize={28}
            className="tablet:text-[18px] whitespace-pre-wrap text-center"
          >
            Connect Your Socials
          </WrappedText>
          <div className="flex flex-row gap-2 items-start justify-start tablet:flex-col">
            <SocialMediaButton
              image={"/icons/twitter.svg"}
              title="Twitter"
              onClick={async () => {
                modals.lazyPush(
                  <ChangeSocialMediaModal
                    title="Twitter"
                    onChange={async (newHandle: string) => {
                      await updateDetails({
                        twitter: newHandle,
                      });
                    }}
                  />
                );
              }}
              completed={socialMedia.twitter.handle || false}
            />
            <SocialMediaButton
              image={"/icons/telegram.svg"}
              title="Telegram"
              onClick={async () => {
                modals.lazyPush(
                  <ChangeSocialMediaModal
                    title="Telegram"
                    onChange={async (newHandle: string) => {
                      await updateDetails({
                        telegram: newHandle,
                      });
                    }}
                  />
                );
              }}
              completed={socialMedia.telegram.handle || false}
              imageProps={{
                className: "scale-[0.88]",
              }}
            />
            <SocialMediaButton
              image={"/icons/discord.svg"}
              title="Discord"
              onClick={async () => {
                modals.lazyPush(
                  <ChangeSocialMediaModal
                    title="Discord"
                    onChange={async (newHandle: string) => {
                      await updateDetails({
                        discord: newHandle,
                      });
                    }}
                  />
                );
              }}
              completed={socialMedia.discord.handle || false}
              imageProps={{
                className: "scale-[0.88]",
              }}
            />
          </div>
        </div>

        <Divisor className="border-custom-textColor rotate-[90deg] max-w-[50%] opacity-30" />
        <div className="flex flex-col gap-1 items-center">
          <WrappedText
            fontStyle="bold"
            fontSize={28}
            className="tablet:text-[18px] whitespace-pre-wrap text-center"
          >
            Share w/ Your Frens
          </WrappedText>
          <div className="flex flex-row gap-2 items-start justify-center tablet:flex-col  w-max">
            <InfoProvider contents="Share On Twitter">
              <TwitterShareButton
                url="https://yieldchain.io/whitelist"
                title="I just signed up to the @yield_chain whitelist!"
              >
                <WrappedImage
                  src={"/icons/twitter.svg"}
                  width={42}
                  height={42}
                  className="cursor-pointer transition duration-200 ease-in-out  hover:scale-[1.05]"
                />
              </TwitterShareButton>
            </InfoProvider>

            <InfoProvider contents="Share On Telegram">
              <TelegramShareButton
                url="https://yieldchain.io/whitelist"
                title="I just signed up to the @yieldchain whitelist!"
              >
                <WrappedImage
                  src={"/icons/telegram.svg"}
                  width={42}
                  height={42}
                  className="cursor-pointer transition duration-200 ease-in-out scale-[0.88] hover:scale-[1.05]"
                />
              </TelegramShareButton>
            </InfoProvider>
            <InfoProvider contents="Share On Whatsapp">
              <WhatsappShareButton
                url="https://yieldchain.io/whitelist"
                title="I just signed up to the Yieldchain whitelist!"
              >
                <div className=" rounded-full relative">
                  <div className="bg-white rounded-full w-[100%] h-[100%] absolute scale-[0.7]"></div>
                  <WrappedImage
                    src={"/icons/whatsapp.svg"}
                    width={42}
                    height={42}
                    className="cursor-pointer transition duration-200 ease-in-out scale-[0.88] hover:scale-[1.05]"
                  />
                </div>
              </WhatsappShareButton>
            </InfoProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

const SocialMediaButton = forwardRef(
  ({
    image,
    imageProps,
    title,
    size = 42,
    onClick,
    completed,
    className,
  }: {
    image: ImageSrc;
    imageProps?: Partial<ImageProps>;
    title: string;
    size?: number;
    onClick?: () => Promise<void>;
    completed: false | string;
    className?: string;
  }) => {
    return (
      <InfoProvider contents={completed || `Set Your ${title}`}>
        <div
          className={
            "flex flex-row relative cursor-pointer transition duration-200 ease-in-out  hover:scale-[1.05]" +
            " " +
            (className || "")
          }
          onClick={onClick}
        >
          <WrappedImage
            src={image}
            {...imageProps}
            width={size}
            height={size}
          />
          <div className="flex flex-row items-center justify-center rounded-full bg-white bg-opacity-80 overflow-hidden absolute z-100">
            {completed && (
              <div className="flex flex-row items-center justify-center p-0.5 rounded-full bg-green-500">
                <WrappedImage
                  src={"/icons/checkmark-light.svg"}
                  width={14}
                  height={14}
                />
              </div>
            )}
          </div>
        </div>
      </InfoProvider>
    );
  }
);

SocialMediaButton.displayName = "SocialMediaButton";

const ChangeSocialMediaModal = ({
  title,
  onChange,
  className,
  closeModal,
  ...props
}: {
  title: string;
  onChange: (newSocialMedia: `@${string}`) => Promise<void>;
} & BaseModalChildProps) => {
  const [newInput, setNewInput] = useState<string>("");

  return (
    <div
      {...props}
      className={
        className +
        " " +
        "flex flex-col items-center justify-start backdrop-blur-xl rounded-xl bg-custom-subbg w-[70%] py-8 px-10 gap-6 h-max"
      }
    >
      <WrappedText
        fontSize={42}
        fontStyle="bold"
      >{`Set Your ${title}`}</WrappedText>
      <div className="flex flex-row gap-2 items-center w-[50%] max-w-[300px]">
        <WrappedText fontStyle="bold" fontSize={22} className="text-opacity-40">
          @
        </WrappedText>
        <WrappedInput
          style={{
            width: "100%",
          }}
          onChange={(e) => setNewInput(e.target.value)}
          showGlass={false}
        ></WrappedInput>
      </div>
      <RegulerButton
        onClick={async () => {
          const inputToUse = newInput[0] == "@" ? newInput : `${newInput}`;
          await onChange(inputToUse as `@${string}`);
          closeModal?.();
        }}
      >{`Done`}</RegulerButton>
    </div>
  );
};

ChangeSocialMediaModal.displayName = "ChangeSocialMediaModal";
