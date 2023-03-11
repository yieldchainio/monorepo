"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = void 0;
const react_1 = __importDefault(require("react"));
const TextArea_module_css_1 = __importDefault(require("./css/TextArea.module.css"));
const TextArea = ({ textArea = "Search for a vault ID, token or protocol", }) => {
    return <div className={TextArea_module_css_1.default.textAreaDiv}>{textArea}</div>;
};
exports.TextArea = TextArea;
//# sourceMappingURL=TextArea.js.map