/**
 * @notice
 * Yieldchain's Database Models / Interfaces
 */
import { JsonValue } from "@yc/yc-data";
import { address, ChainID } from "./global.js";
import type { Typeflags, ProtocolType } from "@prisma/client";
import { StepType } from "./yc.js";
export interface DBAction {
    id: string;
    name: string;
    popularity: number;
    available: boolean;
    table_name: string | null;
    functions_ids: string[];
}
export interface DBStrategy {
    id: string;
    address: address;
    title: string;
    chain_id: ChainID;
    deposit_token_id: string;
    creator_id: string;
    verified: boolean;
    execution_interval: number;
    steps: JSON;
}
export interface DBNetwork {
    id: number;
    name: string;
    logo: string;
    color: string | null;
    json_rpc: string;
    diamond_address: string | null;
    block_explorer: string | null;
}
export interface DBFunction {
    id: string;
    name: string;
    callback: boolean;
    inverse_function_id: string | null;
    dependancy_function_id: string | null;
    address_id: string;
    arguments_ids: string[];
    actions_ids: string[];
    outflows: string[];
    inflows: string[];
    typeflag: Typeflags;
    ret_typeflag: Typeflags;
    signature: string;
    copy_args: boolean;
}
export interface DBArgument {
    id: string;
    solidity_type: string;
    value: string;
    name: string | null;
    custom: boolean;
    typeflag: Typeflags;
    ret_typeflag: Typeflags;
    relating_token: string | null;
    overridden_custom_values: Array<string | null>;
}
export interface DBFlow {
    id: string;
    token_id: string;
    direction: FlowDirection;
}
export interface DBToken {
    id: string;
    name: string;
    address: string;
    symbol: string;
    logo: string;
    decimals: number;
    chain_id: ChainID;
}
export interface DBProtocol {
    id: string;
    name: string;
    website: string;
    logo: string;
    available: boolean;
    color: string | null;
    chain_ids: number[];
    address_ids: string[];
    twitter: string | null;
    telegram: string | null;
    discord: string | null;
    types: ProtocolType[];
}
export interface DBContract {
    id: string;
    address: string;
    chain_id: ChainID;
    abi: JsonValue;
    functions_ids: string[];
    protocol_id: string;
    related_contracts: string[];
}
export interface DBUser {
    id: string;
    address: string;
    username: string;
    description: string;
    profile_picture: string | null;
    twitter: string | null;
    telegram: string | null;
    discord: string | null;
    whitelisted: boolean;
    verified: boolean;
}
export interface JSONStep {
    id: string | "root";
    parentId?: string | null;
    protocol?: string;
    tokenPercentages: Array<[string, number]>;
    inflows: DBToken[];
    outflows: DBToken[];
    action?: string;
    function: DBFunction | null;
    customArguments: any[];
    children: JSONStep[];
    data: any | null;
    type: StepType;
    triggerName?: string | null;
    triggerDescription?: string | null;
    triggerIcon?: string | {
        dark: string;
        light: string;
    } | null;
}
export interface DBStatistic {
    id: string;
    strategy_id: string;
    timestamp: string | Date;
    apy: number;
    gasFee: string;
}
export declare enum FlowDirection {
    INFLOW = 0,
    OUTFLOW = 1
}
