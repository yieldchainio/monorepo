import { BaseComponentProps } from "components/types";

export interface ModalWrapperProps extends BaseComponentProps {
  modalKey: number;
  children: React.ReactNode;
  closeFunction?: (modalKey: number) => any;
  callbackRoute?: `/${string}`;
  align?: boolean;
}
