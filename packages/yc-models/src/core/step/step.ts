import { DBStep } from "../../types";
import { YCAction } from "../action/action";
import { YCClassifications } from "../context/context";
import { YCProtocol } from "../protocol/protocol";
import { YCToken } from "../token/token";

export class YCStep {
  protocol: YCProtocol;
  inflows: YCToken[] = [];
  outflows: YCToken[] = [];
  children: YCStep[] = [];
  // parent: YCStep;
  // percentage: number;
  // action: YCAction;

  constructor(_step: DBStep, _context: YCClassifications) {
    // @ts-ignore // TODO
    this.protocol = new YCProtocol(_step.protocol_details, _context);
  }
}
