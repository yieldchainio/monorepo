/**
 * Types for the strategy builder service
 */
import { JSONStep, address, bytes } from "@yc/yc-models";
import { Request } from "express";
export interface VaultCreationRequest extends Request {
    body: {
        seedSteps: JSONStep;
        treeSteps: JSONStep;
        vaultVisibility: boolean;
        depositTokenID: string;
        chainID: number;
    };
}
type FalseValidationResponse = {
    status: false;
    reason: string;
};
type TrueValidationResponse = {
    status: true;
};
export type ValidationResponse = FalseValidationResponse | TrueValidationResponse;
export type BuilderResponse = FalseValidationResponse | (TrueValidationResponse & {
    deploymentCalldata: bytes;
});
export type ApprovalPairs = address[][];
export type StepsToEncodedFunctions = Map<string, bytes>;
export {};
