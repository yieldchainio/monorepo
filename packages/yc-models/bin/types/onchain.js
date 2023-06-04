/**
 * Onchain YC types
 */
export var TriggerTypes;
(function (TriggerTypes) {
    TriggerTypes["AUTOMATION"] = "Automation";
    TriggerTypes["DEPOSIT"] = "Deposit";
    TriggerTypes["WITHDRAWAL"] = "Withdrawal";
})(TriggerTypes || (TriggerTypes = {}));
export const VAULT_CREATED_EVENT_SIGNATURE = "VaultCreated(address,address,address)";
export const LPCLIENT_TUPLE = "tuple(bytes4 addSelector,bytes4 removeSelector,bytes4 harvestSelector,bytes4 balanceOfLpSelector,address clientAddress,bytes extraData)";
//# sourceMappingURL=onchain.js.map