import { EthersLog } from "./utility-types";
/************************************** */
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
/************************************** */
export type ReceivedOnchainEvent = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            log: EthersLog;
        };
    }[];
};
export type StartOffchainAction = Omit<BaseSQSEvent, "Messages"> & {
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
export type RequestFork = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            requestFork: {
                ganache_options: {
                    chain: {
                        chainId: number;
                    };
                    fork: {
                        url: string;
                        blockNumber: number;
                    };
                    logging?: {
                        logger: {
                            log: (message: string) => void;
                        };
                    };
                };
            };
        };
    }[];
};
export type CreateFork = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            createFork: {
                ganache_options: {
                    chain: {
                        chainId: number;
                    };
                    fork: {
                        url: string;
                        blockNumber: number;
                    };
                    logging?: {
                        logger: {
                            log: (message: string) => void;
                        };
                    };
                };
            };
            secret_key: string;
        };
    }[];
};
export type ForkCreated = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            forkCreated: {
                requester_id: string;
                fork_id: string | null;
                json_rpc_url: string | null;
            };
        };
    }[];
};
export type ForkReady = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            forkReady: {
                fork_status: boolean;
                requester_id: string | null;
                fork_id: string | null;
                json_rpc_url: string | null;
            };
        };
    }[];
};
export type ListenToFork = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            listenToFork: {
                fork_status: boolean;
                requester_id: string | null;
                fork_id: string | null;
                json_rpc_url: string | null;
            };
        };
    }[];
};
export type DeleteForkRequest = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            deleteForkRequest: {
                fork_id: string;
            };
        };
    }[];
};
export type KillFork = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            killFork: {
                fork_id: string;
            };
        };
    };
};
export type ForkDeleted = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            forkDeleted: {
                fork_id: string;
            };
        };
    };
};
export type StopForkListening = Omit<BaseSQSEvent, "Messages"> & {
    Messages: {
        MessageId: string;
        ReceiptHandle: string;
        MD5OfBody: string;
        Body: {
            stopForkListening: {
                fork_id: string;
            };
        };
    };
};
export {};
