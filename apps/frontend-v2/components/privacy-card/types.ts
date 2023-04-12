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
  setOwn: () => void;
  emojies: string;
  reasons: ReasonToChoose[]
}

export type ReasonToChoose = {
  reason: string;
  description: string;
};
