import { IFullFunction } from "src/App";
export declare const getAddressDetails: (address: string, network: DBNetwork) => Promise<{
    functions: IFullFunction[];
    abi: any[];
}>;
