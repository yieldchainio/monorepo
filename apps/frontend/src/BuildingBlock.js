"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingBlock = void 0;
const react_1 = __importDefault(require("react"));
const buildingBlock_module_css_1 = __importDefault(require("./css/buildingBlock.module.css"));
const BuildingBlock = ({ src, children }) => {
    return (<div className={buildingBlock_module_css_1.default.blockDiv}>
      <img src={src}/>
      <div className={buildingBlock_module_css_1.default.innerDiv}>{children}</div>
      <img src="Vector.png"/>
    </div>);
};
exports.BuildingBlock = BuildingBlock;
//# sourceMappingURL=BuildingBlock.js.map