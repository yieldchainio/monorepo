// Enum Types For Available Function Call Types
export var CallTypes;
(function (CallTypes) {
    CallTypes[CallTypes["STATICCALL"] = 2] = "STATICCALL";
    CallTypes[CallTypes["DELEGATECALL"] = 3] = "DELEGATECALL";
    CallTypes[CallTypes["CALL"] = 4] = "CALL";
})(CallTypes || (CallTypes = {}));
/**
 * Type of context when encoding
 */
export var EncodingContext;
(function (EncodingContext) {
    EncodingContext["SEED"] = "seed";
    EncodingContext["TREE"] = "tree";
    EncodingContext["UPROOT"] = "uproot";
})(EncodingContext || (EncodingContext = {}));
export var StepType;
(function (StepType) {
    StepType["STEP"] = "step";
    StepType["TRIGGER"] = "trigger";
    StepType["CONDITION"] = "condition";
})(StepType || (StepType = {}));
export var Timestamps;
(function (Timestamps) {
    Timestamps["Minutes"] = "Minutes";
    Timestamps["Hours"] = "Hours";
    Timestamps["Days"] = "Days";
    Timestamps["Weeks"] = "Weeks";
    Timestamps["Months"] = "Months";
    Timestamps["Years"] = "Years";
})(Timestamps || (Timestamps = {}));
//# sourceMappingURL=yc.js.map