import { ForkResponse } from "./fork-types.js";
interface ganacheOptions {
    chain: {
        chainId: number;
    };
    fork: {
        url: string;
        blockNumber: number;
    };
}
declare const createFork: (ganacheOptions: ganacheOptions) => Promise<ForkResponse>;
export default createFork;
