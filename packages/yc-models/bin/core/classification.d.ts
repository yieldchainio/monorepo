import { DBAddress, DBToken, DBArgument } from "../types/db";
import YCFunc from "./function";
import YCArgument, { CustomArgument } from "./argument";
import YCFlow from "./flow";
import YCToken from "./token";
import YCProtocol from "./protocol";
import YCNetwork from "./network";
import YCAddress from "./address";
import YCStrategy from "./strategy";
import YCUser from "./user";
import YCAction from "./action";
import { ClassificationContext } from "../types/yc";
/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
export interface StaticContext {
    addresses: YCAddress[];
    functions: YCFunc;
    tokens: YCToken[];
    parameters: DBArgument[];
    flows: YCFlow[];
    protocols: YCProtocol[];
    strategies: YCStrategy[];
}
export declare class YCClassifications {
    #private;
    private static instance;
    static fromJSON: (_jsonContext: ClassificationContext) => YCClassifications;
    constructor(_jsonContext?: ClassificationContext);
    private initiallized;
    initiallize: (_api_url?: string) => Promise<YCClassifications>;
    addresses: () => YCAddress[];
    networks: () => YCNetwork[];
    functions: () => YCFunc[];
    arguments: (_customValue?: CustomArgument) => YCArgument[];
    flows: () => YCFlow[];
    strategies: () => YCStrategy[];
    protocols: () => YCProtocol[];
    tokens: () => YCToken[];
    actions: () => YCAction[];
    users: () => YCUser[];
    getAddressYC: (_address_or_id: number | string) => DBAddress | null;
    getFunction: (_function_id: number) => YCFunc | null;
    getArgument: (_argument_id: number) => YCArgument | null;
    getFlow: (_flow_id: number) => YCFlow | null;
    getToken: (_token_id_or_address: number, _chain_id?: number | string, _dbToken?: DBToken) => YCToken | null;
    getProtocol: (_protocolID: number) => YCProtocol | null;
    getNetwork: (_chainID: number) => YCNetwork | null;
    getUser: (_userID: string) => YCUser | null;
}
