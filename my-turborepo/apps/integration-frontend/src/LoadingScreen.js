"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreen = void 0;
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const LoadingScreen = (props) => {
    let backgrounds = {
        normal: "black",
        dark: "rgb(30, 30, 30)",
        light: "white",
        dimmed: "rgba(0, 0, 0, 0.5)",
    };
    let style = {
        backgroundColor: backgrounds[props.background] || "black",
    };
    return (<div className={maincss_module_css_1.default.loadingScreen} style={style}>
      <img src="/loadingpepe.gif" alt="" style={{
            width: "20%",
        }}/>
    </div>);
};
exports.LoadingScreen = LoadingScreen;
//# sourceMappingURL=LoadingScreen.js.map