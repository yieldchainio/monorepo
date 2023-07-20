import { erc20ABI, useSigner } from "wagmi";
import {
  ApprovalTransactionRequest,
  UpgradeTierTransactionRequest,
} from "../types";
import { Contract, providers } from "ethers";
import ERC20ABI from "@yc/yc-models/src/ABIs/erc20.json" assert { type: "json" };
import { Interface } from "ethers/lib/utils";
import { ContractTransaction, PopulatedTransaction } from "ethers";
import { Transaction } from "components/transactions-submmiter/types";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };

export function parseUpgradeTierTransaction(
  req: UpgradeTierTransactionRequest
): Transaction {
  if (!req.token.network?.diamondAddress)
    throw "Cannot Upgrade Tier On Unsupported Network";
  const iface = new Interface(DiamondABI);
  const calldata = iface.encodeFunctionData(iface.getFunction("upgradeTier"), [
    req.tier.id,
    req.amount,
    req.isLifetime,
  ]);

  const txn = {
    to: req.token.network.diamondAddress,
    data: calldata,
  };

  const duration = req.tier.getDuration(req.amount);

  const name = req.tier.name;

  const amount = req.token.formatDecimals(req.amount);

  return {
    request: txn,
    awaitingSubmitProps: {
      title: `Upgrade To ${name}`,
      description: `Pay ${amount} To Enjoy ${duration} Months Of ${name}`,
      image: req.token.logo,
    },
    loadingProps: {
      title: `Purchasing ${duration} ${name} Months... `,
      description: `Submmited Tier Upgrade To The Network, Waiting For It To Finallize...`,
      image: req.token.logo,
    },
    successProps: {
      title: `Purchased ${duration} Months Of ${name}`,
      description: `Successfully Upgraded Tier! Enjoy ${duration} Extra Months Of ${name} `,
      image: "/icons/green-checkmark-full.svg",
    },
    errorProps: {
      title: `Failed To Upgrade To ${name}`,
      description: `Purchase Of ${duration} ${name} Months Failed`,
      image: "/icons/error.png",
    },
  };
}
