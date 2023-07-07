import { bytes } from "@yc/yc-models";
import { AbiCoder } from "ethers";

export const EMPTY_BYTES_ARRAY = AbiCoder.defaultAbiCoder().encode(
  ["bytes[]"],
  [[]]
);

const InsufficientGasBalanceSelector = "0x0dc1692a";
const TriggerNotReadySelector = "0x74961e17";

function isCustomRevert(error: any): error is { data: string } {
  return (
    "data" in error &&
    typeof error.data == "string" &&
    error.data.slice(0, 2) == "0x"
  );
}

function hasSelector(error: { data: string }, selector: `0x${string}`) {
  return error.data.slice(0, 10) == selector;
}
export function IsTriggerNotReadyError(error: any): boolean {
  return isCustomRevert(error) && hasSelector(error, TriggerNotReadySelector);
}

export function isInsufficientGasBalanceError(error: any): boolean {
  return (
    isCustomRevert(error) && hasSelector(error, InsufficientGasBalanceSelector)
  );
}
