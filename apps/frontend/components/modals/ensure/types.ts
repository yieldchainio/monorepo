/**
 * Types for the ensure modal
 */

import { BaseComponentProps } from "components/types";

export type EnsuranceFeel = "neutral" | "negative" | "positive";

export interface EnsureModalProps extends BaseComponentProps {
  ensureLabel?: string;
  ensureDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  feel?: EnsuranceFeel;
  confirmHandler: () => void | Promise<void>;
  cancelHandler?: () => void | Promise<void>;
  modalKey: number;
}
