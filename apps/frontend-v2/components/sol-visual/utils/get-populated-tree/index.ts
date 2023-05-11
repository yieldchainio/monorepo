/**
 * Get a populated Step tree of sol TXNs from transfer data
 */

import { YCToken } from "@yc/yc-models";
import axios from "axios";
import {
  BASE_PADDING_TOP,
  EDGE_HEIGHT,
  SOL_TXN_NODE_GAP,
  SOL_TXN_NODE_HEIGHT,
  SOL_TXN_NODE_WIDTH,
  TOKEN_BOX_HEIGHT,
  TOKEN_BOX_WIDTH,
} from "components/sol-visual/constants";
import { EDGE_WIDTH } from "components/steps/components/edge/constants";
import { Step } from "utilities/classes/step";
import { Position } from "utilities/classes/step/types";
import {
  MinimalTokenMetadata,
  TokenMetadata,
  TokenNode,
  WalletNode,
} from "./types";
import { Wallet } from "ethers";
import { getTransferInstructions } from "../get-transfer-instructions";

export const getPopulatedSolTransfersTree = async (txnID: string) => {
  /**
   * Get all the transfer instructions (token + native)
   */
  const transfersInstructions = (await getTransferInstructions(txnID)) as {
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint?: string;
  }[];

  /**
   * We are creating different "columns" of trnasfers, not an actual tree.
   * So we keep track of the column size and location on each iteration
   */
  const totalWidth =
    transfersInstructions.length * (SOL_TXN_NODE_WIDTH + EDGE_HEIGHT);

  /**
   * The current position in the tree.
   * It starts off at the total width - the node's width. Then every iteration we subtract a node's width from it (+ a gap)
   *
   * As for the Y position, its always a key-pair of transferrer => transferee, so there's no need (it's always 0 Y for parent, and then EDGE_HEIGHT for child)
   */
  let currentXAxisPosition =
    totalWidth - (SOL_TXN_NODE_WIDTH + SOL_TXN_NODE_GAP) * 3;

  /**
   * We also cache token metadata results to potentially save on API cals
   */
  const cachedTokensMetadata = new Map<string, MinimalTokenMetadata>();

  const transfersWithPositionsAndTokenMetadata: Array<
    [WalletNode, TokenNode, WalletNode]
  > = [];

  /**
   * Iterate over each one of them, and populate the position, as well as token metadata
   */
  for (const transferInstruction of transfersInstructions) {
    /**
     * Get the mint address( either token address or native SOL address)
     */
    const mintAddress =
      transferInstruction?.mint || "0x11111111111111111111111111111111";

    /**
     * Set to the cached metadata either the already cache metadata, or a new one from the helius API
     */
    cachedTokensMetadata.set(
      mintAddress,
      cachedTokensMetadata.get(mintAddress) ||
        getMinimalTokenMetadata(
          (
            await getMetadata([
              transferInstruction.mint || "0x11111111111111111111111111111111",
            ])
          )[0] as TokenMetadata
        )
    );

    /**
     * Retreive it
     */
    const metadata = cachedTokensMetadata.get(mintAddress);

    /**
     * Assert that it must exist
     */
    if (!metadata)
      throw (
        "Cannot Get TXNs Visuallization - Token MEtadata is Undefined For Token Address:" +
        mintAddress
      );

    /**
     * Push to our populated transfers array the new array, which includes the from wallet node, the token node, and the to wallet node
     */
    transfersWithPositionsAndTokenMetadata.push([
      {
        address: transferInstruction.fromUserAccount,
        position: {
          x: currentXAxisPosition,
          y: 0 + BASE_PADDING_TOP,
        },
      },
      {
        token: metadata,
        position: {
          x: currentXAxisPosition + TOKEN_BOX_WIDTH / 2,
          y:
            BASE_PADDING_TOP +
            SOL_TXN_NODE_HEIGHT +
            EDGE_HEIGHT / 2 -
            TOKEN_BOX_HEIGHT,
        },
        amount: transferInstruction.tokenAmount,
      },
      {
        address: transferInstruction.toUserAccount,
        position: {
          x: currentXAxisPosition,
          y: EDGE_HEIGHT + BASE_PADDING_TOP + SOL_TXN_NODE_HEIGHT,
        },
      },
    ]);

    /**
     * @notice
     * Finally, we deduct from the currentXAxisPosition the node width + gap,
     * and continue to next iteration
     */
    currentXAxisPosition -= SOL_TXN_NODE_WIDTH + SOL_TXN_NODE_GAP;
  }

  return transfersWithPositionsAndTokenMetadata;
};

async function getMetadata(tokens: string[]) {
  let url = `https://api.helius.xyz/v0/tokens/metadata?api-key=317671ec-e85b-4189-a2a1-b2eb86d932ec`;
  let mintAccounts = [];

  let queryTokens = tokens;
  queryTokens = queryTokens.slice(0, 99);

  let query = await axios.post(url, { mintAccounts: queryTokens });
  mintAccounts = query.data;

  return mintAccounts;
}

const getMinimalTokenMetadata = (metadata: TokenMetadata) => {
  if (metadata.mint === "0x11111111111111111111111111111111")
    return {
      symbol: "SOL",
      logo: "/icons/solana.png",
      address: metadata.mint as string,
    };
  return {
    symbol: metadata.offChainData.symbol,
    logo: metadata.offChainData.image,
    address: metadata.mint as string,
  };
};
