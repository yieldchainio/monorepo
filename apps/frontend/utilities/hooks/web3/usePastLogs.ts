/**
 * Get past logs matching some description
 */

import { Contract, ethers } from "ethers";
import { useMemo } from "react";

interface Log {
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
}
interface UsePastLogsProps {
  contract: ethers.providers.JsonRpcProvider;
  filter?: (log: Log) => boolean;
}

export const usePastLogs = ({ provider, filter }: UsePastLogsProps) => {
  const filtered = useMemo(() => {
    const logs = contract.pr;
  }, [contract, contract.address, eventSig, filter]);
};
