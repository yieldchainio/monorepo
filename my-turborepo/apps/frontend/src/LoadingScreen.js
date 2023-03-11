"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreen = void 0;
const react_1 = __importStar(require("react"));
const LoadingScreen = (props) => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    return (<div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 1)",
            position: "fixed",
            zIndex: 100000,
            left: "0px",
        }}>
      <img alt="" src="/loadingscreen.gif" style={{
            width: "300px",
            height: "300px",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        }}/>
      ;
    </div>);
};
exports.LoadingScreen = LoadingScreen;
//# sourceMappingURL=LoadingScreen.js.map