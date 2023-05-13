import { DBToken } from "../../offchain-types";
declare const isTokenOnLifi: (tokenAddress: string | DBToken | null) => Promise<boolean>;
export default isTokenOnLifi;
