import { YCClassifications, YCToken } from "@yc/yc-models";
import { Tier } from "components/cards/tier";
import { BigNumber, Contract, providers } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };

import { useModals } from "utilities/hooks/stores/modal";
import { useSubmitTransactions } from "utilities/hooks/web3/useSubmitTransactions";
import { useYCNetwork } from "utilities/hooks/yc/useYCNetwork";
import { useEffect, useMemo, useState } from "react";
import { YCTier } from "@yc/yc-models/src/core/tier";
import { InputsModal } from "components/modals/inputs";
import { useLogs } from "utilities/hooks/stores/logger";

export const TiersSection = ({ chosenTier }: { chosenTier: YCTier }) => {
  const network = useYCNetwork();

  const modals = useModals();

  const logs = useLogs();

  const { submitTransactions } = useSubmitTransactions();

  const [paymentToken, setPaymentToken] = useState<YCToken | null>(
    network.nativeToken
  );

  useEffect(() => {
    (async () => {
      const diamondAddress = network.diamondAddress;

      if (!diamondAddress || !network.jsonRpc) throw "Unsupported Network";

      const diamondContract = new Contract(
        diamondAddress,
        DiamondABI,
        new providers.JsonRpcProvider(network.jsonRpc)
      );

      const tokenAddress = await diamondContract.getPaymentToken();

      const token = YCClassifications.getInstance().getToken(
        tokenAddress,
        network.id
      );

      if (!token) throw "Cannot Find Payment Token";

      setPaymentToken(token);
    })();
  }, [network.id]);

  const [monthlyPayingAmount, setMonthlyPayingAmount] = useState<bigint>(0n);

  return (
    <div className="w-full flex flex-row items-center justify-center gap-6 ">
      <Tier
        tierName="Premium"
        price={paymentToken?.formatDecimals(chosenTier.monthlyPrice || 0n) || 0}
        description="per month"
        onClick={() => {
          if (
            !paymentToken ||
            !chosenTier.monthlyPrice ||
            !network.diamondAddress
          )
            throw "Non Existant Details";

          modals.lazyPush(
            <InputsModal
              inputs={[
                {
                  title: `${chosenTier.name} Duration To Purchase (Months)`,
                  setter: (input: string) => {
                    const parsed = parseFloat(input);
                    setMonthlyPayingAmount(
                      isNaN(parsed) ? 0n : paymentToken.parseDecimals(parsed)
                    );
                  },
                  description: (value: string) => {
                    // alert("COmputing Description With Val: " + value);
                    const parsed = parseInt(value);
                    if (!parsed) return "Invalid Input";

                    const costRaw = chosenTier.monthlyPrice * BigInt(parsed);

                    let txt = `${parsed} Months Of ${
                      chosenTier.name
                    } Will Cost ${paymentToken.formatDecimals(costRaw)} ${
                      paymentToken.symbol
                    }`;

                    if (costRaw == chosenTier.lifetimePrice)
                      txt +=
                        " - Consider Purchasing A Lifetime Subscription For The Same Price";
                    else if (costRaw > chosenTier.lifetimePrice)
                      txt +=
                        " - Consider Purchasing A Lifetime Subscription For A Lower Price";

                    return txt;
                  },
                  condition: (value: string): string | true => {
                    const parsed = parseFloat(value);

                    alert("Parsed " + parsed);

                    if (parsed < 1) return "Min. 1 Month";

                    return true;
                  },
                  value: monthlyPayingAmount,
                  type: "number",
                  inputProps: {
                    step: "1",
                    placeholder: "No. Of Months",
                  },
                },
              ]}
              onConfirm={() => {
                if (!network.diamondAddress)
                  throw logs.lazyPush({
                    type: "error",
                    message: "Cannot Upgrade Tier On Unsupported Network",
                  });

                submitTransactions([
                  {
                    type: "approve",
                    token: paymentToken,
                    amount: chosenTier.monthlyPrice,
                    spender: network.diamondAddress,
                  },
                  {
                    type: "upgradeTier",
                    token: paymentToken,
                    amount: chosenTier.monthlyPrice,
                    tier: chosenTier,
                    isLifetime: false,
                  },
                ]);
              }}
            />
          );

          // submitTransactions([
          //   {
          //     type: "approve",
          //     token: paymentToken,
          //     amount: chosenTier.monthlyPrice,
          //     spender: network.diamondAddress,
          //   },
          //   {
          //     type: "upgradeTier",
          //     token: paymentToken,
          //     amount: chosenTier.monthlyPrice,
          //     tier: chosenTier,
          //     isLifetime: false,
          //   },
          // ]);
        }}
        borderColors={{
          heavyColor: "var(--border)",
          lightColor: "var(--border)",
        }}
        style={{
          opacity: "100%",
        }}
      />
      <Tier
        tierName="Premium"
        price={
          paymentToken?.formatDecimals(chosenTier.lifetimePrice || 0n) || 0
        }
        description="one time payment"
        onClick={() => {
          if (
            !paymentToken ||
            !chosenTier.lifetimePrice ||
            !network.diamondAddress
          )
            throw "Non Existant Details";

          submitTransactions([
            {
              type: "approve",
              token: paymentToken,
              amount: chosenTier.lifetimePrice,
              spender: network.diamondAddress,
            },
            {
              type: "upgradeTier",
              token: paymentToken,
              amount: chosenTier.lifetimePrice,
              tier: chosenTier,
              isLifetime: true,
            },
          ]);
        }}
        borderColors={{
          heavyColor: "var(--yc-lb)",
          lightColor: "var(--yc-ly)",
        }}
        style={{
          opacity: "75%",
        }}
      />
    </div>
  );
};
