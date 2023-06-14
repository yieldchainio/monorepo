/**
 * Constants for the reguler step's Choose Action components
 */

import { ImageSrc } from "components/wrappers/types";
import { SwapConfig } from "./config/swap";
import { ActionConfigs } from "utilities/classes/step/types";

/**
 * Constants for the IDs of each config
 */
export const STAKE_ID = "62bb7a58-6e0c-4b11-90ce-d416bd3dd10f";
export const SWAP_ID = "c947f5bf-004f-40e6-b859-dd28c7fac0b0";
export const LP_ID = "1fd39f5f-d1f0-40f8-afe1-58dd4eb815bf";
export const HARVEST_ID = "dc5c5c0a-e594-4974-8a46-829a76a95fa7";

/**
 * Mapping action IDs to enum propreties
 */
export const ACTION_IDS_TO_ENUM_KEY: Record<string, ActionConfigs> = {
  "c947f5bf-004f-40e6-b859-dd28c7fac0b0": ActionConfigs.SWAP,
  "62bb7a58-6e0c-4b11-90ce-d416bd3dd10f": ActionConfigs.STAKE,
  "1fd39f5f-d1f0-40f8-afe1-58dd4eb815bf": ActionConfigs.LP,
  "dc5c5c0a-e594-4974-8a46-829a76a95fa7": ActionConfigs.HARVEST,
  "b966c7fa-431e-47f9-83a4-fe0d7054a570": ActionConfigs.SUPPLY
};

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
  "b966c7fa-431e-47f9-83a4-fe0d7054a570": {
    dark: "/action-icons/supply-light.svg",
    light: "/action-icons/supply-dark.svg"
  }
};
