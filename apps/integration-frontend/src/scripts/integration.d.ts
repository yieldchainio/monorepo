import { DBNetwork, IntegrateAbleFunction } from "../types";
export interface IntegrationInterface {
    functions: IntegrateAbleFunction[];
    contract_address: string;
    protocol_identifier: number;
    chain_id: number;
    abi: any[];
    network: DBNetwork;
}
export declare const integrateIntoDB: (_integrationObject: IntegrationInterface) => Promise<any>;
