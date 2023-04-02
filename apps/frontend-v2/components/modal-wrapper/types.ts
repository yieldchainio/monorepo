export interface ModalWrapperProps {
  modalKey: number;
  children: React.ReactNode;
  closeFunction?: (modalKey: number) => any;
  callbackRoute?: `/${string}`;
}
