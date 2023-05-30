/**
 * useSwap hook
 * Returns abstracted functions for making swaps
 */

import {
  PerpBasketLpData,
  YCClassifications,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";
import { useCallback, useEffect, useState } from "react";
import { Step } from "utilities/classes/step";
import { useConfigContext } from "../../../../../hooks/useConfigContext";
import { useProtocols } from "../../../../../hooks/useProtocols";
import { useTokens } from "../../../../../hooks/useTokens";
import { ProtocolType, TokenTags } from "@prisma/client";
import { useLogs } from "utilities/hooks/stores/logger/index.js";

export const useAddPerpBasketLiquidity = ({
  step,
  triggerComparison,
  protocolType = ProtocolType.LIQUIDITY,
}: {
  step: Step;
  triggerComparison: () => void;
  protocolType?: ProtocolType;
}) => {
  /**
   * Get some base variables that we need (context, network & our available tokens)
   */
  const {
    context,
    network,
    availableTokens: stepAvailableTokens,
  } = useConfigContext({
    step,
    triggerComparison,
  });

  /**
   * Get all protocols with add liquidity available
   */
  const protocols = useProtocols({
    networks: network ? [network] : undefined,
    type: protocolType,
  });

  /**
   * States to keep track of the chosen tokens and protocol
   */
  const [basketDepositToken, setBasketDepositToken] = useState<YCToken | null>(
    null
  );
  const [representationToken, setRepresentationToken] =
    useState<YCToken | null>(null);
  const [protocol, setProtocol] = useState<YCProtocol | null>(null);

  /**
   * Get all of our available tokens for this add liquidity operation
   */
  const availableTokens: YCToken[] = useTokens({
    networks: network ? [network] : undefined,
    tokens: stepAvailableTokens,
    protocols: protocol ? [protocol] : [],
  });

  const logs = useLogs();

  /**
   * Functions to handle choosing the basket deposit token
   */
  const chooseBasketDepositToken = useCallback(
    (token: YCToken) => {
      // Assert that it must be available to us
      if (!availableTokens.find((_token) => _token.id === token.id))
        logs.throwError(
          "Cannot Choose Basket Deposit Token - Token Is Unavailable At This Step"
        );

      // Set the step's data to it (for persistant visual representation of the choice)
      step.data.perpBasketLp = {
        ...(step.data.perpBasketLp || {}),
        basketDepositToken: token.toJSON(),
      } as PerpBasketLpData;

      // Add this to the step's outflows
      step.addOutflow(token);

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({ onlyCompleted: false }))]
  );

  const chooseProtocol = useCallback(
    (protocol: YCProtocol) => {
      const token = YCClassifications.getInstance().tokens.find(
        (_token) =>
          _token.tags.includes(TokenTags.PERP_BASKET_LP) &&
          _token.parentProtocol?.id == protocol?.id
      );

      if (!token)
        logs.throwError(
          "Cannot Choose Protocol - No Perp Basket LP token is classified underneath it"
        );

      step.data.perpBasketLp = {
        ...(step.data?.perpBasketLp || {}),
        protocol: protocol.toJSON(),
        basketRepresentationToken: token?.toJSON(),
      };

      step.protocol = protocol;

      triggerComparison();
    },
    [JSON.stringify(step.toJSON({}))]
  );

 

  /**
   * Initiallize the choices from persistance if not yet
   */
  useEffect(() => {
    // Shorthand for the data
    const data = step.data.perpBasketLp;

    // If our from token is not init yet
    // And there is a persisted DBtoken in the data,
    // Set our token to it
    if (data?.basketDepositToken)
      setBasketDepositToken(new YCToken(data.basketDepositToken, context));

    if (data?.protocol) {
      const newProtocol = new YCProtocol(data.protocol, context);
      setProtocol(newProtocol);
      step.protocol = newProtocol;
    }

    if (data?.basketRepresentationToken)
      setRepresentationToken(
        new YCToken(data.basketRepresentationToken, context)
      );
  }, [
    step.data.perpBasketLp?.protocol?.id,
    step.data.perpBasketLp?.basketDepositToken?.id,
    step.data.perpBasketLp?.basketRepresentationToken?.id,
  ]);

  // Return the functions & variables
  return {
    chooseProtocol,
    protocols,
    protocol,
    network,
    availableTokens,
    basketDepositToken,
    representationToken,
    chooseBasketDepositToken,
  };
};
