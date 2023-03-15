"use strict";
// TODO: Dumping all the unneeeded calculation crap here
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortStepsArr = exports.DetermineWidth = void 0;
const utils_1 = require("../utils/utils");
const DetermineWidth = (_root) => {
    let root = { ..._root };
    let width = 0;
    let height = 0;
    let totalNodesAmount = 0;
    const determineBundleWidth = (_bundle, isRoot) => {
        let bundle = [..._bundle];
        let bundleWidth = 0;
        let nodesNum = 0;
        for (let i = 0; i < bundle.length; i++) {
            let step = bundle[i];
            // if (step.data.type === NodeStepEnum.PLACEHOLDER) {
            //   null;
            // }
            // Checking whether the bundle has an even number of nodes,
            // Or an odd number of nodes
            let isBundleSymmetric = (0, utils_1.isNumSymmetric)(bundle.length / 2);
            // Adding the width and height of the current iterated
            // Step to the bundle width and height
            if (!isBundleSymmetric && !isRoot) {
                if (i !== 0) {
                    bundleWidth += step.data.width;
                    nodesNum++;
                }
            }
            else {
                bundleWidth += step.data.width;
                nodesNum++;
            }
            if (isRoot) {
                bundleWidth += step.data.width;
                nodesNum++;
            }
            if (step.children) {
                let childrenRes = determineBundleWidth(step.children, false);
                bundleWidth += childrenRes.pxWidth;
                nodesNum += childrenRes.nodesNum;
            }
            // Setting the total width it's own sum + the bundle's su
            width += bundleWidth;
            totalNodesAmount += nodesNum;
        }
        height += 96; // Spacing required for edges
        // Iteration to find tallest node in bundle
        let heightsArr = [];
        for (const step of bundle) {
            if (step.data.height) {
                heightsArr.push(step.data.height);
            }
        }
        try {
            height += Math.max(...heightsArr);
        }
        catch (e) {
            for (const step of bundle) {
                if (step.data.height) {
                    height += step.data.height;
                }
            }
        }
        return { pxWidth: bundleWidth, nodesNum: nodesNum };
    };
    let res = determineBundleWidth([_root], true);
    width = res.pxWidth; // same as above for width
    totalNodesAmount = res.nodesNum; // same as above for totalNodesAmount
    return { width: width, nodesNum: totalNodesAmount, height: height };
};
exports.DetermineWidth = DetermineWidth;
const sortStepsArr = (arr, removeEmpties) => {
    let sortedArr = [...arr].filter((step) => {
        return !!step;
    });
    sortedArr = sortedArr.sort((a, b) => {
        return a.step_identifier - b.step_identifier;
    });
    let oldToNewIDsMapping = new Map();
    if (removeEmpties) {
        sortedArr.forEach((step, index) => {
            if (step.empty && step.empty == true) {
                sortedArr.splice(index, 1);
            }
        });
    }
    for (let i = 0; i < sortedArr.length; i++) {
        let step = sortedArr[i];
        oldToNewIDsMapping.set(step.step_identifier, i);
    }
    sortedArr = sortedArr.map((step, index) => {
        let newObj = { ...step };
        let newParentId = oldToNewIDsMapping.get(newObj.parent_step_identifier);
        newObj.step_identifier = index;
        newObj.parent_step_identifier = newParentId;
        return newObj;
    });
    return sortedArr;
};
exports.sortStepsArr = sortStepsArr;
//# sourceMappingURL=Dump.js.map