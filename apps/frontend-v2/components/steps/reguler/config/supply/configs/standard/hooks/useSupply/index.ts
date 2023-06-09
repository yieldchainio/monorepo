/**
 * useSwap hook
 * Returns abstracted functions for making swaps
 */

import {
  PerpBasketLpData,
  SupplyData,
  YCClassifications,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";
import { useCallback, useEffect, useState } from "react";
import { Step } from "utilities/classes/step";
import { useConfigContext } from "../../../../../hooks/useConfigContext";
import { useProtocols } from "../../../../../hooks/useProtocols";
import { useTokens } from "../../../../../hooks/useTokens";
import { getSupplyInflowTokens } from "../../utils/get-inflow-token";
import { ProtocolType, TokenTags } from "@prisma/client";
import { useLogs } from "utilities/hooks/stores/logger";

export const useSupply = ({
  step,
  triggerComparison,
  protocolType = ProtocolType.LENDING,
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
  const [protocol, setProtocol] = useState<YCProtocol | null>(null);

  const [collateralToken, setCollateralToken] = useState<YCToken | null>(null);

  const [representationToken, setRepresentationToken] =
    useState<YCToken | null>(null);

  /**
   * Get all of our available tokens for this add liquidity operation
   */
  const availableTokens: YCToken[] = useTokens({
    networks: network ? [network] : undefined,
    tokens: stepAvailableTokens,
    protocols: protocol ? [protocol] : [],
    tags: [TokenTags.LENDING_COLLATERAL],
  });

  const availableMarkets: YCToken[] = useTokens({
    networks: network ? [network] : undefined,
    tokens: undefined,
    protocols: protocol ? [protocol] : [],
    tags: [TokenTags.BORROWABLE_ASSET],
  });

  const logs = useLogs();

  /**
   * Functions to handle choosing the basket deposit token
   */
  const chooseCollateral = useCallback(
    async (token: YCToken) => {
      // Set the step's data to it (for persistant visual representation of the choice)
      if (!protocol)
        throw logs.throwError("Cannot choose collateral without protocol");

      const repToken = await getSupplyInflowTokens(protocol, token);
      step.data.supply = {
        ...(step.data.supply || {}),
        collateral: token.toJSON(),
        representationToken: repToken.toJSON(),
      } as SupplyData;

      // Add this to the step's outflows
      step.clearFlows();

      step.addOutflow(token);
      step.addInflow(repToken);

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

      if (token) {
        step.data.perpBasketLp = {
          ...(step.data?.perpBasketLp || {}),
          protocol: protocol.toJSON(),
          basketRepresentationToken: token?.toJSON(),
        };
      }

      step.data.lp = {
        ...(step.data.lp || {}),
        protocol: protocol.toJSON(),
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
    const protocol = data?.protocol || step.data.lp?.protocol;
    const repToken =
      data?.basketRepresentationToken ||
      YCClassifications.getInstance()
        .tokens.find(
          (_token) =>
            _token.tags.includes(TokenTags.PERP_BASKET_LP) &&
            _token.parentProtocol?.id == protocol?.id
        )
        ?.toJSON();

    // If our from token is not init yet
    // And there is a persisted DBtoken in the data,
    // Set our token to it
    if (data?.basketDepositToken)
      setBasketDepositToken(new YCToken(data.basketDepositToken, context));

    if (protocol) {
      const newProtocol = new YCProtocol(protocol, context);
      setProtocol(newProtocol);
      step.protocol = newProtocol;
    }

    if (repToken) {
      setRepresentationToken(new YCToken(repToken, context));
    }
  }, [
    step.data.perpBasketLp?.protocol?.id,
    step.data.perpBasketLp?.basketDepositToken?.id,
    step.data.perpBasketLp?.basketRepresentationToken?.id,
  ]);

  // WE watch the standard LP stuff to see if theres any change (initial choices)
  useEffect(() => {
    if (step.data.lp?.protocol && !step.data.perpBasketLp?.protocol.id) {
      chooseProtocol(
        new YCProtocol(step.data.lp.protocol, YCClassifications.getInstance())
      );
    }
  }, [step.data.lp?.protocol.id]);

  async function test() {
    const token = YCClassifications.getInstance().tokens.find(
      (token_) => token_.symbol == "USDC" && token_.network?.id == 42161
    );
    console.log("Token", token);
    console.log("Protocok", protocol);
    const res = await getSupplyInflowTokens(
      protocol as YCProtocol,
      token as YCToken
    );
  }

  // Return the functions & variables
  return {
    chooseProtocol,
    protocols,
    protocol,
    network,
    availableTokens,
    basketDepositToken,
    representationToken,
    allBasketTokens,
    chooseBasketDepositToken,
    test,
  };
};
