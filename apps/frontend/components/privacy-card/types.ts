/**
 * Types for the privacy card
 */

export interface PrivacyCardProps {
  title: string;
  subtitle: string;
  position: "left" | "right";
  chosen: boolean;
  heavyColor: string;
  lightColor: string;
  setOwn: (chosen: boolean) => void;
  emojies: string;
  reasons: ReasonToChoose[]
  blocked?: boolean
  blockedContent?: React.ReactNode
}

export type ReasonToChoose = {
  reason: string;
  description: string;
};
