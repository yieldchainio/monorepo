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
  TRIGGERSENGINE = "TRIGGERSENGINE",
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
  desiredCount: 1 | 2 | 3 | 4 | 5 | 6;
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
  SKINNY,
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
  [ServiceStrength.SKINNY]: {
    cpu: 512,
    memoryLimitMiB: 4096,
  },
  [ServiceStrength.MID]: {
    cpu: 1024,
    memoryLimitMiB: 8192,
  },
  [ServiceStrength.STRONG]: {
    cpu: 4096,
    memoryLimitMiB: 8192,
  },
  [ServiceStrength.ARNOLD]: {
    cpu: 4096,
    memoryLimitMiB: 16384,
  },
};
