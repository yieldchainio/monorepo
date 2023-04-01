import { BaseComponentProps } from "components/types";

export interface RegulerButtonProps extends BaseComponentProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  className?: string;
  children?: React.ReactNode;
}
