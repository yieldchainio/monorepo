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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StraightEdge = exports.LeftEdge = exports.RightEdge = exports.StraightLine = exports.LeftLine = exports.RightLine = void 0;
const react_1 = __importStar(require("react"));
const lines_module_css_1 = __importDefault(require("./css/lines.module.css"));
const RightLine = (props) => {
    const { width, height, top, left, percentage } = props;
    return (<div className={lines_module_css_1.default.rightLine} style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top}px`,
            left: `${left}px`,
        }}>
      <div className={lines_module_css_1.default.percentageBoxEditable} style={{ left: "calc(100% - 28px)" }}>
        <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
      </div>
    </div>);
};
exports.RightLine = RightLine;
const LeftLine = (props) => {
    const { width, height, top, left, percentage } = props;
    return (<div className={lines_module_css_1.default.leftLine} style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${top}px`,
            left: `${left}px`,
        }}>
      <div className={lines_module_css_1.default.percentageBoxEditable}>
        <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
      </div>
    </div>);
};
exports.LeftLine = LeftLine;
const StraightLine = (props) => {
    const { height, top, left, percentage } = props;
    return (<div className={lines_module_css_1.default.straightLine} style={{ height: `${height}px`, top: `${top}px`, left: `${left}px` }}>
      <div className={lines_module_css_1.default.percentageBoxEditable}>
        <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
      </div>
    </div>);
};
exports.StraightLine = StraightLine;
const RightEdge = (props) => {
    const { x1, y1, x2, y2, percentage, placeholder, percentageModalHandler, parentId, childId, } = props;
    const percentageBoxRef = (0, react_1.useRef)();
    return (<div className={lines_module_css_1.default.rightLine} style={{
            width: `${x2 - x1}px`,
            height: `${y2 - y1}px`,
            top: `${y1}px`,
            left: `${x1}px`,
            zIndex: `9999999`,
        }}>
      <div className={lines_module_css_1.default.percentageBoxEditable} ref={percentageBoxRef} onClick={() => {
            percentageModalHandler({
                parentId: parentId,
                childId: childId,
                percentage: percentage,
                top: percentageBoxRef.current.getBoundingClientRect().top,
                left: percentageBoxRef.current.getBoundingClientRect().left,
            });
            console.log("Onclick: ", `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`);
        }} style={{ left: "calc(100% - 28px)" }}>
        <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
      </div>
    </div>);
};
exports.RightEdge = RightEdge;
const LeftEdge = (props) => {
    const { x1, y1, x2, y2, percentage, placeholder, percentageModalHandler, parentId, childId, } = props;
    const percentageBoxRef = (0, react_1.useRef)();
    return (<div className={lines_module_css_1.default.leftLine} style={{
            width: `${x1 - x2}px`,
            height: `${y2 - y1}px`,
            top: `${y1}px`,
            left: `${x2}px`,
            zIndex: `9999999`,
        }}>
      <div className={lines_module_css_1.default.percentageBoxEditable} ref={percentageBoxRef} onClick={() => {
            percentageModalHandler({
                parentId: parentId,
                childId: childId,
                percentage: percentage,
                top: percentageBoxRef.current.getBoundingClientRect().top,
                left: percentageBoxRef.current.getBoundingClientRect().left,
            });
            console.log("Onclick: ", `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`);
        }}>
        {" "}
        <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
        <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
      </div>
    </div>);
};
exports.LeftEdge = LeftEdge;
const StraightEdge = (props) => {
    const { x1, y1, x2, y2, percentage, placeholder, percentageModalHandler, parentId, childId, } = props;
    const percentageBoxRef = (0, react_1.useRef)();
    return (<div className={lines_module_css_1.default.straightLine} style={{
            height: `${y2 - y1}px`,
            top: `${y1}px`,
            left: `${x1}px`,
            zIndex: `15`,
            borderLeft: placeholder ? "1px dashed #ffffff31" : "",
        }}>
      {!placeholder && (<div className={lines_module_css_1.default.percentageBoxEditable} ref={percentageBoxRef} onClick={() => {
                percentageModalHandler({
                    parentId: parentId,
                    childId: childId,
                    percentage: percentage,
                    top: percentageBoxRef.current.getBoundingClientRect().top,
                    left: percentageBoxRef.current.getBoundingClientRect().left,
                });
                console.log("Onclick: ", `top:  ${percentageBoxRef.current.offsetTop}, left: ${percentageBoxRef.current.offsetLeft},}`);
            }}>
          <div className={lines_module_css_1.default.percentageText}>{percentage}%</div>
          <img src="/editicon.svg" alt="" className={lines_module_css_1.default.editIcon}/>
        </div>)}
    </div>);
};
exports.StraightEdge = StraightEdge;
//# sourceMappingURL=Lines.js.map