import { IFlow } from "./scripts/map-funcs-to-flows";
export interface IFullArg {
    name: string;
    tempId: number;
    type: string;
    value: string | null;
    group_id: number;
}
export interface IFullFunction {
    tempId: number;
    name: string;
    args: IFullArg[];
    flows: IFlow[];
    txnsAmount: number;
    counterFuncId: number | null;
    unlockedByFuncId: number | null;
    chosen: boolean;
    actionId?: number;
    chosenFlows?: IFlow[];
}
declare function App(): JSX.Element;
export default App;
