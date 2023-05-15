/**
 * useFunctions
 * a hook to return YC functions based on some filtering
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { UseFunctionsProps } from "./types";
import { useMemo } from "react";

export const useFunctions = ({
  networks,
  tokens,
  action,
  protocols,
}: UseFunctionsProps) => {
  /**
   * Get all global functions
   */
  const allFunctions = useYCStore((state) => state.context.functions);

  /**
   * Memoize the filtered functions and return them
   */
  const memoFunctions = useMemo(() => {
    console.log(
      "Details Inside Memo",
      allFunctions.length,
      networks?.[0]?.name,
      tokens?.[0]?.symbol,
      action?.name,
      protocols?.[0]?.name
    );
    return allFunctions.filter((func) => {
      // It must be on one of the specified networks, if any
      if (
        networks &&
        !networks.some((network) => network.id === func.address?.network?.id)
      )
        return false;

      // It must include the action specified, if any
      if (action && !func.actions.some((_action) => _action.id == action.id))
        return false;

      // It must be under atleast one of the provided protocols
      if (
        protocols &&
        !protocols.some((protocol) =>
          protocol.contracts.find((address) =>
            address.functions.some((_func) => _func.id == func.id)
          )
        )
      )
        return false;

      if (
        tokens &&
        func.outflows.some(
          (token) => !tokens.some((toecan) => toecan.id == token.id)
        )
      )
        // It must outflow only our available tokens
        return false;

      return true;
    });
  }, [
    allFunctions.length,
    networks?.length,
    tokens?.length,
    action?.id,
    protocols?.length,
    protocols,
    protocols?.[0],
  ]);

  console.log(
    "Function sDetails",
    allFunctions.length,
    networks?.[0]?.name,
    tokens?.[0]?.symbol,
    action?.name,
    protocols?.[0]?.name
  );
  return memoFunctions;
};
