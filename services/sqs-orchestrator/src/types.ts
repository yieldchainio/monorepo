import { EthersLog } from "@yc/yc-models";

type SQSMessage = {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: any;
};

export interface BaseSQSEvent {
  ResponseMetadata: {
    RequestId: string;
  };
  Messages: SQSMessage[];
}

export type InboundOnchainEvent = Omit<BaseSQSEvent, "Messages"> & {
  Messages: {
    MessageId: string;
    ReceiptHandle: string;
    MD5OfBody: string;
    Body: {
      log: EthersLog;
    };
  }[];
};

export type OutboundHydrationRunRequest = Omit<BaseSQSEvent, "Messages"> & {
  Messages: {
    MessageId: string;
    ReceiptHandle: string;
    MD5OfBody: string;
    Body: {
      startOffchainAction: {
        log: EthersLog;
      };
    };
  }[];
};
