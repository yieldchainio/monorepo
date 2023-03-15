import { ethers } from "ethers";
export declare const getStrategyTxid: (_file_name: string, _network_id: string | number) => Promise<{
    abi: ethers.InterfaceAbi;
    bytecode: any;
}>;
export declare const verifyContract: (_address: string, _networkName?: string) => void;
