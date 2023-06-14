export interface TxnDetails {
  description: "Human readable interpretation of the transaction";
  type: "UNKNOWN";
  source: "FORM_FUNCTION";
  fee: 5000;
  feePayer: "8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y";
  signature: "yy5BT9benHhx8fGCvhcAfTtLEHAtRJ3hRTzVL16bdrTCWm63t2vapfrZQZLJC3RcuagekaXjSs2zUGQvbcto8DK";
  slot: 148277128;
  timestamp: 1656442333;
  nativeTransfers: {
    fromUserAccount: string;
    toUserAccount: string;
    amount: 0;
  }[];
  tokenTransfers: {
    fromUserAccount: string;
    toUserAccount: string;
    fromTokenAccount: string;
    toTokenAccount: string;
    tokenAmount: 0;
    mint: string;
  }[];
  accountData: [
    {
      account: string;
      nativeBalanceChange: 0;
      tokenBalanceChanges: [
        {
          userAccount: "F54ZGuxyb2gA7vRjzWKLWEMQqCfJxDY1whtqtjdq4CJ";
          tokenAccount: "2kvmbRybhrcptDnwyNv6oiFGFEnRVv7MvVyqsxkirgdn";
          mint: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ";
          rawTokenAmount: {
            tokenAmount: string;
            decimals: 0;
          };
        }
      ];
    }
  ];
  transactionError: {
    error: string;
  };
  instructions: [
    {
      accounts: ["8uX6yiUuH4UjUb1gMGJAdkXorSuKshqsFGDCFShcK88B"];
      data: "kdL8HQJrbbvQRGXmoadaja1Qvs";
      programId: "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8";
      innerInstructions: [
        {
          accounts: [string];
          data: string;
          programId: string;
        }
      ];
    }
  ];
  events: {
    nft: {
      description: string;
      type: "NFT_SALE";
      amount: 1000000;
      fee: 5000;
      feePayer: "8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y";
      signature: "4jzQxVTaJ4Fe4Fct9y1aaT9hmVyEjpCqE2bL8JMnuLZbzHZwaL4kZZvNEZ6bEj6fGmiAdCPjmNQHCf8v994PAgDf";
      slot: 148277128;
      timestamp: 1656442333;
      saleType: "AUCTION";
      buyer: string;
      seller: string;
      staker: string;
      nfts: [
        {
          mint: "DsfCsbbPH77p6yeLS1i4ag9UA5gP9xWSvdCx72FJjLsx";
          tokenStandard: "NonFungible";
        }
      ];
    };
    swap: {
      nativeInput: {
        account: "2uySTNgvGT2kwqpfgLiSgeBLR3wQyye1i1A2iQWoPiFr";
        amount: "100000000";
      };
      tokenInputs: [null];
      tokenOutputs: [null];
      tokenFees: [null];
      nativeFees: [null];
      innerSwaps: [
        {
          tokenInputs: [null];
          tokenOutputs: [null];
          tokenFees: [null];
          nativeFees: [null];
          programInfo: {
            source: "ORCA";
            account: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";
            programName: "ORCA_WHIRLPOOLS";
            instructionName: "whirlpoolSwap";
          };
        }
      ];
    };
  };
}
