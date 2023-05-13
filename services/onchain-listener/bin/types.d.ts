export type address = string;
export declare enum ChainID {
    Ethereum = 1,
    BinanceSmartChain = 56,
    Polygon = 137,
    Fantom = 250,
    Avalanche = 43114,
    Arbitrum = 42161
}
export interface DBStrategy {
    strategy_identifier: number;
    address: address;
    name: string;
    upkeep_id: number;
    apy: number;
    tvl: number;
    main_protocol_identifier: number;
    creator_user_identifier: number;
    chain_id: ChainID;
    main_token_identifier: number;
    final_token_identifier: number;
    is_verified: boolean;
    is_trending: boolean;
    execution_interval: number;
    strategy_object: JSON;
}
