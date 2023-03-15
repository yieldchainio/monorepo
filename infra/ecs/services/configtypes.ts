/**
 * @notice
 * Types/interfaces for the configuration of our services in the config.ts file within the same directory as this file
 */

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
  type: ServiceTypes;
  name: string;
}

// Interface for a service config
export interface IServiceConfig extends BaseServiceConfig {
  subdomain: string | null;
  portMappings: { hostPort: number; containerPort: number }[];
  targetGroupsARNs: string[];
  initialDeployment: boolean;
}

// Interface for a worker config
export interface IWorkerConfig extends BaseServiceConfig {}

// Config for a service/worker
export type ServiceOrWorkerConfig = IWorkerConfig | IServiceConfig;
