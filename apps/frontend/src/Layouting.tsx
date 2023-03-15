import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { MetaMaskInpageProvider } from "@metamask/providers";

import { stratify, tree } from "d3-hierarchy";
import { NodeStepEnum } from "StrategyBuilder/Enums";
import { DetermineWidth } from "./Contexts/Dump";
declare var window: any;
const ethereum = window.ethereum as MetaMaskInpageProvider;

export const layoutNodes = (strategySteps: any, windowWidth: any) => {
  const sortStepsArr = (arr: any) => {
    let sortedArr = [...arr].filter((step: any) => {
      return !!step;
    });
    sortedArr = sortedArr.sort((a: any, b: any) => {
      return a.step_identifier - b.step_identifier;
    });
    let oldToNewIDsMapping = new Map();
    sortedArr = sortedArr.map((step: any, index: number) => {
      oldToNewIDsMapping.set(step.step_identifier, index);
      let newObj = { ...step };
      let newParentId = oldToNewIDsMapping.get(newObj.parent_step_identifier);
      newObj.step_identifier = index;
      newObj.parent_step_identifier = newParentId
        ? newParentId
        : newObj.parent_step_identifier;
      return newObj;
    });
    return sortedArr;
  };

  let stepsTorender = sortStepsArr([...strategySteps]);
  console.log("Sorted Steps To Render First", stepsTorender);
  for (let i = 0; i < stepsTorender.length; i++) {
    let step = stepsTorender[i];
    if (step.type == NodeStepEnum.PLACEHOLDER) {
      continue;
    }

    let doesHaveChildren = stepsTorender.find((_step: any) => {
      let shouldReturn =
        _step.parent_step_identifier === step.step_identifier &&
        _step.type !== NodeStepEnum.PLACEHOLDER;

      return shouldReturn;
    });

    let isCompleteStep =
      step.type !== NodeStepEnum.PLACEHOLDER &&
      step.type !== NodeStepEnum.CHOOSE_ACTION &&
      step.type !== NodeStepEnum.CONFIG_ACTION;

    if (!doesHaveChildren) {
      let arrToSplice = [];
      let currentStepHeight = step.height;
      let basePlaceholderHeight = 96;
      let latestId = step.step_identifier;
      while (currentStepHeight >= basePlaceholderHeight) {
        stepsTorender.splice(i + 1, 0, {
          step_identifier: stepsTorender.length,
          parent_step_identifier: latestId,
          type: NodeStepEnum.PLACEHOLDER,
          function_identifiers: [],
          width: 327,
          height: 96,
          empty: isCompleteStep ? false : true,
        });
        latestId = stepsTorender[i + 1].step_identifier;
        currentStepHeight -= basePlaceholderHeight;
      }
    }
  }

  console.log("StepsToRender after splicigjn loop", stepsTorender);

  let hierarchy = stratify()
    .id((d: any) => d.step_identifier)
    .parentId((d: any) => d.parent_step_identifier)(
    sortStepsArr(stepsTorender)
  );

  console.log("Hierarchy ", hierarchy);

  let totalWidth = 0;
  let totalHeight = 0;

  let floorToHeight = new Map();
  let tallestArr = [];
  for (const node of hierarchy.descendants()) {
    let depth = node.depth;
    floorToHeight.get(depth)
      ? floorToHeight.set(depth, [...floorToHeight.get(depth), node])
      : floorToHeight.set(depth, [node]);
  }
  for (const [key, value] of floorToHeight) {
    let tallestNode = value.reduce((prev: any, current: any) => {
      return prev.data.height > current.data.height ? prev : current;
    });
    tallestArr.push(tallestNode);
  }

  interface IData {
    step_identifier: number;
    parent_step_identifier: number;
    type: NodeStepEnum | string;
    function_identifiers: number[];
    width: number;
    height: number;
    empty?: boolean;
  }

  interface IPosition {
    x: number;
    y: number;
  }

  interface YcNode {
    position: IPosition;
    data: IData;
    children: any;
  }

  let layout = tree()
    .nodeSize([1, 190])
    .separation((a: any, b: any) => {
      let baseWidth = a.data.width + b.data.width;
      let siblingsArrSymmetric = a.parent.children.length % 2 == 0;
      baseWidth ? (baseWidth = baseWidth / 2 + 30) : (baseWidth = 357);
      if (
        siblingsArrSymmetric &&
        a.parent.children.findIndex((d: any) => d.id == a.id) ==
          a.parent.children.length / 2
      ) {
        let addedMargin = windowWidth / 1000;

        baseWidth += (a.parent.data.width / 2.5) * addedMargin - 30;
      }
      return baseWidth;
    });
  // TODO: This Flextree thing was supposed to be able to receive dynamic node sizing,
  // TODO: However, it was breaking the app (Simply froze it when horizontal children
  // TODO: were added...), would be great if i can use it sometime.
  // let layout = flextree({
  //   children: (d: any) => d.children,
  //   nodeSize: (d: any) => [d.data.width, d.data.height * 2],
  //   spacing: (a: any, b: any) => {
  //     let _totalWidth = a.data.width + b.data.width;
  //     return _totalWidth + 30;
  //   },
  // });

  let root = layout(hierarchy);

  let { width, nodesNum, height } = DetermineWidth(root);

  let hierarchialArr: any = [];

  const pushBundles = (node: any, isroot: boolean) => {
    if (isroot) {
      hierarchialArr.push([node]);
    } else {
      hierarchialArr[hierarchialArr.length - 1].push(node);
    }
  };

  return root.descendants().map((d3Step: any) => {
    return {
      ...d3Step.data,
      position: { x: d3Step.x, y: d3Step.y },
      children: d3Step.children,
    };
  });
};
