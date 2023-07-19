import { PrismaClient } from "@yc/yc-data";
import { Endpoints, ClassificationContext, YCUser, YCAction, YCStrategy, YCContract, YCNetwork, YCProtocol, YCToken, YCArgument, YCFunc, DBContract, DBFunction, DBToken, DBArgument, DBStrategy, DBProtocol, DBNetwork, DBAction, DBUser, DBStatistic, JSONTier } from "@yc/yc-models";
import { YCStatistic } from "../strategy/statistic.js";
import { YCTier } from "../tier";
/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
declare class YCClassificationsInternal {
    protected static Instance: YCClassifications;
    static getInstance: (_jsonContext?: ClassificationContext) => YCClassifications;
    protected Addresses: DBContract[];
    protected Functions: DBFunction[];
    protected Tokens: DBToken[];
    protected Parameters: DBArgument[];
    protected Protocols: DBProtocol[];
    protected Strategies: DBStrategy[];
    protected Networks: DBNetwork[];
    protected Actions: DBAction[];
    protected Statistics: DBStatistic[];
    protected Users: DBUser[];
    protected Tiers: JSONTier[];
    YCContractes: YCContract[];
    YCfunctions: YCFunc[];
    YCtokens: YCToken[];
    YCparameters: YCArgument[];
    YCprotocols: YCProtocol[];
    YCstrategies: YCStrategy[];
    YCnetworks: YCNetwork[];
    YCactions: YCAction[];
    YCusers: YCUser[];
    YCStatistics: YCStatistic[];
    YCTiers: YCTier[];
    protected Client: PrismaClient | null;
    /**
     * @notice
     * Loading array indiciating whether
     */
    constructor();
    initiallized: boolean;
    static apiURL: string;
    protected fetchNetworks: () => Promise<void>;
    protected fetchProtocols: () => Promise<void>;
    protected fetchTokens: () => Promise<void>;
    protected fetchAddresses: () => Promise<void>;
    protected fetchFunctions: () => Promise<void>;
    protected fetchArguments: () => Promise<void>;
    protected fetchUsers: () => Promise<void>;
    protected fetchStrategies: () => Promise<void>;
    protected fetchActions: () => Promise<void>;
    protected fetchStatistics: () => Promise<void>;
    protected fetchTiers: () => Promise<void>;
    protected refreshNetworks: () => Promise<void>;
    protected refreshProtocols: () => Promise<void>;
    protected refreshTokens: () => Promise<void>;
    protected refreshAddresses: () => Promise<void>;
    protected refreshFunctions: () => Promise<void>;
    protected refreshArguments: () => Promise<void>;
    protected refreshUsers: () => Promise<void>;
    protected refreshStrategies: () => Promise<void>;
    protected refreshActions: () => Promise<void>;
    protected refreshStatistics: () => Promise<void>;
    protected refreshTiers: () => Promise<void>;
    /**
     * Fetch all endpoints
     */
    protected fetchAll: () => Promise<void>;
    /**
     * Refresh all class endpoints
     */
    protected refreshAll: () => Promise<void>;
    /**
     * All of the configs for each endpoint
     */
    protected ENDPOINT_CONFIGS: {
        [key in Endpoints]: {
            fetch: () => any;
            refresh: () => any;
            get: () => any;
        };
    };
    /**
     * Validates we are not on a browser, and creates a client as needed
     * @param - Client, just for proper compile-time type checking
     */
    protected validateClient: (_client?: PrismaClient | null) => _client is PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined>;
}
export declare class YCClassifications extends YCClassificationsInternal {
    constructor();
    static apiURL: string;
    /**
     * Initiate the context class using a JSON object
     */
    fromJSON: (jsonContext: ClassificationContext) => void;
    /**
     * Convert the class endpoints to JSON
     */
    toJSON: () => ClassificationContext;
    initiallize: (jsonContext?: ClassificationContext, forceFrontend?: boolean) => Promise<void>;
    /**
     * Refresh an endpoint(s)' data
     */
    refresh: (_endpoints: Endpoints[] | Endpoints) => Promise<boolean>;
    get client(): PrismaClient | null;
    get addresses(): YCContract[];
    get rawAddresses(): DBContract[];
    get networks(): YCNetwork[];
    get functions(): YCFunc[];
    get tiers(): YCTier[];
    get rawFunctions(): DBFunction[];
    get arguments(): YCArgument[];
    get rawArguments(): DBArgument[];
    get strategies(): YCStrategy[];
    get rawStrategies(): DBStrategy[];
    get protocols(): YCProtocol[];
    get tokens(): YCToken[];
    get rawTokens(): DBToken[];
    get actions(): YCAction[];
    get users(): YCUser[];
    get statistics(): YCStatistic[];
    getAddress: (_address_id: string) => YCContract | null;
    getAction: (actionId: string) => YCAction | null;
    getFunction: (_function_id: string) => YCFunc | null;
    getArgument: (_argument_id: string) => YCArgument | null;
    getToken: (_token_id_or_address: string, _chain_id?: number | YCNetwork, _dbToken?: DBToken) => YCToken | null;
    getProtocol: (_protocolID: string) => YCProtocol | null;
    getNetwork: (_id: number) => YCNetwork | null;
    getUser: (_userID: string) => YCUser | null;
    getStrategyStats: (_strategyID: string) => YCStatistic[];
}
export {};
