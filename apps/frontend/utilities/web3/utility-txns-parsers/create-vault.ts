import { erc20ABI, useSigner } from "wagmi";
import {
  ApprovalTransactionRequest,
  CreateVaultTransactionRequest,
  UpgradeTierTransactionRequest,
} from "../types";
import { Contract, ethers, providers } from "ethers";
import ERC20ABI from "@yc/yc-models/src/ABIs/erc20.json" assert { type: "json" };
import { AbiCoder, Interface, defaultAbiCoder } from "ethers/lib/utils";
import { ContractTransaction, PopulatedTransaction } from "ethers";
import {
  Transaction,
  TransactionReceipt,
} from "components/transactions-submmiter/types";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import {
  VAULT_CREATED_EVENT_SIGNATURE,
  YCClassifications,
  address,
} from "@yc/yc-models";

export function parseCreateVaultTransaction(
  req: CreateVaultTransactionRequest
): Transaction {
  const calldata = req.builderResult.deploymentCalldata;

  const txn = {
    to: req.network.diamondAddr,
    data: calldata,
  };

  const title = req.strategy.title;

  const token = YCClassifications.getInstance().getToken(
    req.strategy.deposit_token_id
  );

  if (!token) throw "Cannot Deploy Strategy - No Deposit Token Specified";

  return {
    request: txn,
    awaitingSubmitProps: {
      title: `Deploy ${title}`,
      description: `Deploy Your Vault - ${title}`,
      image: {
        dark: "/icons/vault-dark.svg",
        light: "/icons/vault-light.svg",
      },
      subImage: token.logo,
    },
    loadingProps: {
      title: `Deploying ${title}...`,
      description: `Submmited Vault Deployment To The Network...`,
      image: {
        dark: "/icons/vault-dark.svg",
        light: "/icons/vault-light.svg",
      },
      subImage: token.logo,
    },
    successProps: {
      title: `Succesfully Deployed ${title}!`,
      description: (receipt?: TransactionReceipt) => {
        if (!receipt) return "One Moment...";
        const deployLog = receipt.logs.find(
          (log) =>
            log.topics[0] == ethers.utils.id(VAULT_CREATED_EVENT_SIGNATURE)
        );

        if (!deployLog) return "Finding Strategy Address...";

        const vaultAddress: address = defaultAbiCoder.decode(
          ["address"],
          deployLog.topics[1]
        )[0];

        return `Successfully Deployed The ${title} Vault To: ${vaultAddress}! You Will Be Redirected To The Vault's Page Shortly...`;
      },
      image: "/icons/green-checkmark-full.svg",
    },
    errorProps: {
      title: `Failed Deploy ${title}`,
      description: `Deployment Of ${title} To The Network Failed.`,
      image: "/icons/error.png",
    },
  };
}
