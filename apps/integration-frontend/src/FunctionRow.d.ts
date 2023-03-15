import { IFlow } from "./scripts/map-funcs-to-flows";
import { DBAction, IntegrateAbleFunction } from "./types";
import { IFullArg, IFullFunction } from "./App";
export declare const FunctionTableRow: ({ tempId, name, choiceHandler, flows, args, txnsAmount, otherFuncIds, actions, index, removalHandler, address, }: {
    tempId: number;
    name: string;
    choiceHandler: (func: IFullFunction | IntegrateAbleFunction) => void;
    flows: IFlow[];
    args: IFullArg[];
    txnsAmount: number;
    otherFuncIds: number[];
    actions: DBAction[];
    index: number;
    removalHandler: (tempId: number) => void;
    address: string;
}) => JSX.Element;
