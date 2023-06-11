/**
 * Function to attempt getting some underlying contract according
 * to potentially unique contract IDs
 *
 * i.e, yc-diamond refers to the address of the diamond contract we deployed on a given network.
 * lending-adapter refers to the lending adapter address of a given protocol on a given network,
 * etc
 */
import { ZeroAddress } from "ethers";
import { YCClassifications, YCContract, } from "../../../core/index.js";
const LENDING_ADAPTER_IDENTIFIER = "lending-adapter";
export function tryGetUnderlyingContract(step, contract, fallback = contract.address) {
    if (!contract?.address)
        throw "Cannot Attempt Getting Underlying Contract - Function Contract Undefined";
    switch (contract.id) {
        case YCContract.diamondIdentifier:
            return _getFunctionDiamondContract(step);
        case LENDING_ADAPTER_IDENTIFIER:
            return _getFunctionLendingAdapterContract(step);
        default:
            return fallback || ZeroAddress;
    }
}
function _getFunctionDiamondContract(step, func) {
    const network = YCClassifications.getInstance().getNetwork(step.chainId);
    if (!network?.diamondAddress)
        throw ("Cannot Encode A Function When Diamond Address Is Undefined. Network: " +
            network?.id +
            " Function Name: " +
            func?.name || "No Function Provided");
    return network.diamondAddress;
}
function _getFunctionLendingAdapterContract(step) {
    const network = YCClassifications.getInstance().getNetwork(step.chainId);
    if (!network)
        throw "Cannot Encode A Function When network undefined";
    if (!step.protocol)
        throw "Cannot encode lending function when protocol undefined on step";
    const protocol = YCClassifications.getInstance().getProtocol(step.protocol);
    if (!protocol)
        throw "Cannot encode lending function when protocol undefined on step";
    const contract = YCClassifications.getInstance().addresses.find((address) => address.protocol?.id == protocol.id &&
        address.id.includes("LENDINGADAPTER") &&
        address.network?.id == step.chainId);
    if (!contract)
        throw "Cannot encode lending function - Lending adapter undefined on protocol & network";
    return contract.address;
}
//# sourceMappingURL=index.js.map