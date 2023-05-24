/**
 * @notice
 * Types/interfaces for the configuration of our services in the config.ts file within the same directory as this file
 */

import {
  FargateTaskDefinitionProps,
  TaskDefinitionProps,
} from "aws-cdk-lib/aws-ecs/index.js";
import { RepoSettings, ServiceTypes } from "../types";

// ===================
//       ENUMS
// ===================
/**
 * @notice
 * Each service goes in here.
 */
export enum ServicesAndWorkers {
  DATAPROVIDER = "DATAPRVDR",
  ONCHAINLISTENER = "ONCHAINLISTENER",
  STRATEGYBUILDER = "STRATEGYBUILDER",
  FRONTEND = "FRONTEND",
  INTEGRATIONPRVDR = "INTEGRATIONPRVDR",
  INTEGRATIONFRNTD = "INTEGRATIONFRNTD",
  OFFCHAINACTIONS = "OFFCHAINACTIONS",
  SQSORCHESTRATOR = "SQSORCHESTRATOR",
}

// ===================
//     INTERFACES
// ===================

/**
 * @notice
 * Defines a base service
 * extended by Worker/Service/?Job
 */

// @notice
// A base interface describing a service,
// meant to be extended
interface BaseServiceConfig {
  ENVs: Record<string, string>;
  repoSettings: RepoSettings;
  name: string;
  type: ServiceTypes;
  requiredStrength: ServiceStrength;
}

// Interface for a service config
export interface IServiceConfig extends BaseServiceConfig {
  type: ServiceTypes.SERVICE;
  subdomain: string | null;
  portMappings: { hostPort: number; containerPort: number }[];
}

// Interface for a worker config
export interface IWorkerConfig extends BaseServiceConfig {
  type: ServiceTypes.WORKER;
}

// Config for a service/worker
export type ServiceOrWorkerConfig = IWorkerConfig | IServiceConfig;

export enum ServiceStrength {
  WEAK,
  MID,
  STRONG,
  ARNOLD,
}

export const ServicesStrengthsConfigs: Record<
  ServiceStrength,
  { cpu: number; memoryLimitMiB: number }
> = {
  [ServiceStrength.WEAK]: {
    cpu: 256,
    memoryLimitMiB: 512,
  },
  [ServiceStrength.MID]: {
    cpu: 2048,
    memoryLimitMiB: 4096,
  },
  [ServiceStrength.STRONG]: {
    cpu: 4096,
    memoryLimitMiB: 8192,
  },
  [ServiceStrength.ARNOLD]: {
    cpu: 8192,
    memoryLimitMiB: 16384,
  },
};
