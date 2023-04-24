/**
 * Types for it
 */

import { YCToken } from "@yc/yc-models";
import { Position } from "utilities/classes/step/types";

export type WalletNode = {
  address: string;
  position: Position;
};

export type TokenNode = {
  token: MinimalTokenMetadata;
  position: Position;
  amount: number;
};

export interface TokenMetadata {
  account: string;
  mint?: string;
  onChainAccountInfo: {
    accountInfo: {
      key: string;
      isSigner: true;
      isWritable: true;
      lamports: number;
      data: {
        parsed: {
          info: {
            decimals: 0;
            freezeAuthority: string;
            isInitialized: true;
            mintAuthority: string;
            supply: string;
          };
          type: string;
        };
        program: string;
        space: 0;
      };
      owner: string;
      executable: true;
      rentEpoch: 0;
    };
    error: "";
  };
  onChainMetadata: {
    metadata: {
      key: string;
      mint: string;
      updateAuthority: string;
      data: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: 0;
        creators: [
          {
            address: string;
            share: string;
            verified: true;
          }
        ];
      };
      tokenStandard: string;
      primarySaleHappened: true;
      isMutable: true;
      editionNonce: 0;
      collection: {
        key: string;
        verified: true;
      };
      collectionDetails: {
        size: 0;
      };
      uses: {
        useMethod: string;
        remaining: 0;
        total: 0;
      };
    };
  };
  offChainData: {
    symbol: string;
    image: string;
    uri: string;
  };
  legacyMetadata: {
    chainId: 0;
    address: string;
    symbol: string;
    name: string;
    decimals: 0;
    logoURI: string;
    tags: [string];
    extensions: {};
  };
}

export interface MinimalTokenMetadata {
  logo: string;
  symbol: string;
  address: string
}
