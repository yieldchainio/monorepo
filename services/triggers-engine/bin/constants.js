import { AbiCoder } from "ethers";
export const EMPTY_BYTES_ARRAY = AbiCoder.defaultAbiCoder().encode(["bytes[]"], [[]]);
const InsufficientGasBalanceSelector = "0x0dc1692a";
const TriggerNotReadySelector = "0x74961e17";
function isCustomRevert(error) {
    return ("data" in error &&
        typeof error.data == "string" &&
        error.data.slice(0, 2) == "0x");
}
function hasSelector(error, selector) {
    return error.data.slice(0, 10) == selector;
}
export function IsTriggerNotReadyError(error) {
    return isCustomRevert(error) && hasSelector(error, TriggerNotReadySelector);
}
export function isInsufficientGasBalanceError(error) {
    return (isCustomRevert(error) && hasSelector(error, InsufficientGasBalanceSelector));
}
//# sourceMappingURL=constants.js.map