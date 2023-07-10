export function isValidNetwork(network) {
    if (network && "id" in network && "provider" in network && "jsonRpc" in network && network.jsonRpc != null)
        return true;
    return false;
}
//# sourceMappingURL=type-checkers.js.map