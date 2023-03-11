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
exports.AutoLine = void 0;
const react_1 = __importStar(require("react"));
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const Enums_1 = require("./Enums");
const Lines_1 = require("../Lines");
const AutoLine = (props) => {
    const { strategySteps, setStrategySteps } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { parentNode, childNode, percentageModalHandler } = props;
    const pixelsToNumber = (pixels) => {
        if (typeof pixels === "number")
            return pixels;
        return Number(pixels.replace("px", ""));
    };
    const childWidth = pixelsToNumber(childNode.width);
    const childHeight = pixelsToNumber(childNode.height);
    const parentWidth = pixelsToNumber(parentNode.width);
    const parentHeight = pixelsToNumber(parentNode.height);
    const parentX = pixelsToNumber(parentNode.position.x);
    const parentY = pixelsToNumber(parentNode.position.y);
    const childX = pixelsToNumber(childNode.position.x);
    const childY = pixelsToNumber(childNode.position.y);
    const percentage = childNode.percentage;
    // Child Anchor Points
    const childRightAnchorX = childX + childWidth + 1; // +1 to account for the line width
    const childRightAnchorY = childY + childHeight / 2 + 1; // +1 to account for the line width
    const childLeftAnchorX = childX - 1; // -1 to account for the line width
    const childLeftAnchorY = childY + childHeight / 2 + 1; // +1 to account for the line width
    const childTopAnchorX = childX + childWidth / 2 + 1; // +1 to account for the line width
    const childTopAnchorY = childY; // -1 to account for the line width
    // Parent Anchor Points
    const parentBottomAnchorX = parentX + parentWidth / 2 + 1; // +1 to account for the line width
    const parentBottomAnchorY = parentY + parentHeight + 1; // +1 to account for the line width
    const parentRightAnchorX = parentX + parentWidth + 1; // +1 to account for the line width
    const parentRightAnchorY = parentY + parentHeight / 2 + 1; // +1 to account for the line width
    const parentLeftAnchorX = parentX - 1; // -1 to account for the line width
    const parentLeftAnchorY = parentY + parentHeight / 2 + 1; // +1 to account for the line width
    // Checks whether the child is considered a Placeholder Node, for styling purposes (i.e,
    // It wont have a percentage box and the line would be dashed instead of solid)
    let isPlaceholder = childNode.type == Enums_1.NodeStepEnum.PLACEHOLDER;
    let direction;
    // Determine The Direction Of The Line Based On The Nodes' Positions
    if (childTopAnchorX > parentBottomAnchorX) {
        direction = "right";
    }
    if (childTopAnchorX < parentBottomAnchorX) {
        direction = "left";
    }
    if (childTopAnchorX === parentBottomAnchorX) {
        direction = "straight";
    }
    // Render The Correct Line Based On The Direction
    let doesHaveDirection = direction ? true : false;
    if (childNode.empty === true) {
        return null;
    }
    return (<div>
      {!doesHaveDirection ? null : direction === "right" ? (<Lines_1.RightEdge x1={parentRightAnchorX} y1={parentRightAnchorY} x2={childTopAnchorX} y2={childTopAnchorY} percentage={percentage} placeholder={isPlaceholder} percentageModalHandler={percentageModalHandler} parentId={parentNode.stepId} childId={childNode.stepId}/>) : direction === "left" ? (<Lines_1.LeftEdge x1={parentLeftAnchorX} y1={parentLeftAnchorY} x2={childTopAnchorX} y2={childTopAnchorY} percentage={percentage} placeholder={isPlaceholder} percentageModalHandler={percentageModalHandler} parentId={parentNode.stepId} childId={childNode.stepId}/>) : direction === "straight" ? (<Lines_1.StraightEdge x1={parentBottomAnchorX} y1={parentBottomAnchorY} x2={childTopAnchorX} y2={childTopAnchorY} percentage={percentage} placeholder={isPlaceholder} percentageModalHandler={percentageModalHandler} parentId={parentNode.stepId} childId={childNode.stepId}/>) : null}
    </div>);
};
exports.AutoLine = AutoLine;
//# sourceMappingURL=AutoLine.js.map