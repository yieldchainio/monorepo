/**
 * Constants for the ensure modal
 */

import { EnsuranceFeel } from "./types";

export const FEEL_TO_CANCEL_COLOR: { [K in EnsuranceFeel]: string } = {
    "negative": "bg-red-800 hover:bg-red-750",
    "positive": "bg-green-800 hover:bg-green-750",
    "neutral": "s"
};
