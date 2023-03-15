import { DBToken } from "src/types";
export declare const classifyOnchainToken: (address: string, network: DBNetwork) => Promise<DBToken | null>;
