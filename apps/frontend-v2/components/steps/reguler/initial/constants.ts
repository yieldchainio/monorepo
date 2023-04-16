/**
 * Constants for the reguler step's Choose Action components
 */

import { ImageSrc } from "components/wrappers/types";

/**
 * Mapping action IDs => Corresponding UI components for configuration of them
 */
export const ACTION_IDS_TO_CONFIGS: Record<string, React.ReactNode> = {};

/**
 * Mapping action IDs => icons
 */

export const ACTION_IDS_TO_ICONS: Record<string, ImageSrc> = {
  "62bb7a58-6e0c-4b11-90ce-d416bd3dd10f": {
    dark: "/action-icons/stake-light.svg",
    light: "/action-icons/stake-dark.svg",
  },
  "1fd39f5f-d1f0-40f8-afe1-58dd4eb815bf": {
    dark: "/action-icons/add-liquidity-light.svg",
    light: "/action-icons/add-liquidity-dark.svg",
  },
  "dc5c5c0a-e594-4974-8a46-829a76a95fa7": {
    dark: "/action-icons/harvest-light.svg",
    light: "/action-icons/harvest-dark.svg",
  },
  "c947f5bf-004f-40e6-b859-dd28c7fac0b0": {
    dark: "/action-icons/swap-light.svg",
    light: "/action-icons/swap-dark.svg",
  },
};
