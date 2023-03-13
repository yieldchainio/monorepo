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

export const ProfileModal = () => {
  return (
    <div className="fixed w-[400px] h-max bg-custom-bcomponentbg top-[80px] translate-x-[-100px] flex flex-col rounded-3xl border-custom-border border-2 bg-opacity-95 py-10 px-5">
      <div className="flex flex-row w-full h-[20%]">
        <div className="flex gap-3.5 items-start justify-start">
          <div className="flex flex-col">
            <WrappedImage src="/profile-examples.svg" width={59} height={59} />
            <Icon
              className="mx-[32px] my-[10%] cursor-pointer hover:scale-[1.05] transition duration-200 ease-in-out absolute"
              iconClassname="fill-current text-custom-lightcomponent hover:text-custom-lightHover transition duration-200 ease-in-out"
            />
          </div>
          <div className="flex flex-col gap-0 py-1">
            <WrappedText fontSize={22} fontStyle="light">
              Ofir Smol
            </WrappedText>
            <div className="flex flex-row gap-2 items-center">
              <WrappedText
                fontSize={13}
                fontStyle="light"
                className="opacity-30"
              >
                0xc6...1929
              </WrappedText>
              <WrappedImage
                src={"/icons/copy.svg"}
                width={12}
                height={12}
                className="cursor-pointer hover:scale-110 transition duration-200 ease-in-out opacity-80"
              ></WrappedImage>
            </div>
          </div>
        </div>
        <RegulerButton
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => null}
          className="py-[8px] px-[10px] ml-auto items-center justify-center my-1"
        >
          <DisconnectIcon iconClassname="text-custom-textColor scale-[1.2] pointer-events-none" />
        </RegulerButton>
      </div>
      <div className="">
        <Section
          title="Stats"
          titleLink="/portfolio"
          fields={{
            Vaults: 5,
            Deposits: "$5,112.14",
            "Create Vaults": 2,
            Royalties: "$1,112.55",
          }}
          key="SectionComponent"
        >
          <div className="w-full">
            <Section fields={{ "Awesome Web3 Protection": "OFF" }}>
              <RegulerButton
                onClick={() => null}
                className="hover:border-green-600 text-sm py-[8px] px-10 border-[2px] mt-3"
                key="SectionComponent"
              >
                Protect Me! 🔒
              </RegulerButton>
            </Section>
          </div>
        </Section>
      </div>
    </div>
  );
};

interface SectionProps {
  title?: string;
  titleLink?: string;
  id?: string;
  fields: Record<string, any>;
  children?: JSX.Element;
}
const Section = ({
  title,
  titleLink,
  fields,
  children,
  id = "SectionComponent",
}: SectionProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        {title && (
          <div className="flex flex-row items-center gap-3 hover:scale-[1.02] hover:bg-custom-dimmed hover:bg-opacity-20 transition duration-200 ease-in-out cursor-pointer rounded-lg py-1 px-3">
            <WrappedText
              fontSize={18}
              fontStyle="light"
              onClick={() => (titleLink ? router.push(titleLink) : null)}
              className={titleLink ? "cursor-pointer" : ""}
            >
              {title}
            </WrappedText>
            {titleLink && (
              <LinkIcon
                iconClassname="text-custom-textColor"
                className="scale-[1.5]"
              />
            )}
          </div>
        )}
        <Divisor className={title ? " mt-2 mb-5" : ""} />
        <div className="flex w-full flex-col gap-5">
          {Object.entries(fields).map((field: Record<string, any>) => {
            return (
              <div className="flex flex-row justify-between">
                <WrappedText
                  fontSize={15}
                  fontStyle="[150]"
                  fontColor="custom-textColor"
                  className="text-opacity-[50%]"
                >
                  {field[0] + ":"}
                </WrappedText>
                <WrappedText fontSize={17} fontStyle="medium">
                  {field[1]}
                </WrappedText>
              </div>
            );
          })}
        </div>
        {children}
        {!React.Children.toArray(children).some((child: any) =>
          isSectionComponent(child)
        ) && <Divisor className=" mb-2 mt-5" />}
      </div>
    </>
  );
};

const isSectionComponent = (child: any): boolean => {
  console.log("Child Is Being Checked With Key: ", child.key);
  return child.key == ".$SectionComponent";
};
