import SQSOrchestrator from "./Orchestrator-Class.js";
export declare const onchainEventHandler: (event: string, Orchestrator: SQSOrchestrator) => Promise<void>;
export declare const forkRequestHandler: (event: string, Orchestrator: SQSOrchestrator) => Promise<void>;
export declare const forkCreatedHandler: (event: string, Orchestrator: SQSOrchestrator) => Promise<void>;
export declare const forkDeleteHandler: (event: string, Orchestrator: SQSOrchestrator) => Promise<void>;
