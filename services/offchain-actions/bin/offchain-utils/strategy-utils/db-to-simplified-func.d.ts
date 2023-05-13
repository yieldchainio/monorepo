import { SimplifiedFunction, DBFunction, ExtendedStepDetails, address } from "../../offchain-types.js";
declare const dbFuncsToSimplifiedFuncs: (_functionsArr: DBFunction[], _stepsArr: ExtendedStepDetails[], _contractAddress: address) => Promise<SimplifiedFunction[]>;
export default dbFuncsToSimplifiedFuncs;
