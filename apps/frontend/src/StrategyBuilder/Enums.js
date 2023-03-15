"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeStepEnum = exports.SizingEnum = void 0;
let medium = { width: 327, height: 96 };
var SizingEnum;
(function (SizingEnum) {
    SizingEnum[SizingEnum["MINI"] = 100] = "MINI";
    SizingEnum[SizingEnum["MEDIUM"] = 327] = "MEDIUM";
    SizingEnum[SizingEnum["LARGE"] = 500] = "LARGE";
})(SizingEnum = exports.SizingEnum || (exports.SizingEnum = {}));
var NodeStepEnum;
(function (NodeStepEnum) {
    NodeStepEnum["PLACEHOLDER"] = "Placeholder";
    NodeStepEnum["CHOOSE_ACTION"] = "Choose Action";
    NodeStepEnum["CONFIG_ACTION"] = "Configure Action";
    NodeStepEnum["COMPLETE"] = "Complete";
})(NodeStepEnum = exports.NodeStepEnum || (exports.NodeStepEnum = {}));
//# sourceMappingURL=Enums.js.map