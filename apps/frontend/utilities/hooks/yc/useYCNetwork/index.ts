/**
 * Context abou current network in YCNetwork
 */

import { useMemo } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useNetwork } from "wagmi";

export const useYCNetwork = () => {
  const network = useNetwork();

  const ycNetworks = useYCStore((state) => state.context.networks);

  const ycNetwork = useMemo(
    () => ycNetworks.find((_network) => _network.id == network.chain?.id),
    [network.chain?.id]
  );

  return ycNetwork || ycNetworks[0];
};
