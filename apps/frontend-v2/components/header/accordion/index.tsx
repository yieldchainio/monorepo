/**
 * An accordion sidebar component for the header
 */

import { ModalWrapper } from "components/modal-wrapper";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import Link from "next/link";
import { useCallback } from "react";
import { useModals } from "utilities/hooks/stores/modal";

export const Accordion = ({
  catagories,
}: {
  catagories: {
    label: string;
    page: string;
    icon: string | { dark: string; light: string };
  }[];
}) => {
  // Get global modals state
  const modals = useModals();

  // Handle a click on the menu (pushes accordion to global state)
  const handleMenuClick = useCallback(() => {
    modals.push((id: number) => ({
      component: (
        <ModalWrapper modalKey={id}>
          <div className="h-[100vh] w-[50vw] bg-custom-componentbg animate-sidebar py-6 px-6 flex flex-col gap-2 mr-auto  rounded-tr-xl rounded-br-xl ">
            {catagories.map((catagory) => {
              return (
                <Link href={catagory.page}>
                  <div className="flex flex-row gap-2 items-center justify-start bg-custom-dropdown bg-opacity-0 hover:bg-opacity-50 transition duration-200 ease-in-out rounded-lg py-4 pl-2">
                    <WrappedImage src={catagory.icon} width={22} height={22} />
                    <WrappedText
                      fontSize={16}
                      className="hover:text-opacity-70"
                    >
                      {catagory.label}
                    </WrappedText>
                  </div>
                </Link>
              );
            })}
          </div>
        </ModalWrapper>
      ),
    }));
  }, []);
  return (
    <WrappedImage
      src={{
        dark: "/icons/menu-light.svg",
        light: "/icons/menu-dark.svg",
      }}
      width={22}
      height={22}
      onClick={handleMenuClick}
      className="cursor-pointer hover:opacity-50 transition duration-200 ease-in-out"
    />
  );
};