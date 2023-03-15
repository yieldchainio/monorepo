import { ContainerDefinition } from "aws-cdk-lib/aws-ecs";
import { defaultPortMappings } from "../lib/utils";
import { RepoSettings, ServiceTypes } from "../types";
import {
  IWorkerConfig,
  IServiceConfig,
  ServicesAndWorkers,
  ServiceOrWorkerConfig,
} from "./configtypes";
import { config } from "dotenv";
config();

/**
 * @ENVs
 * Map service => it's enviorment variables
 */
const ENVs: { [key in ServicesAndWorkers]?: Record<string, string> } = {
  [ServicesAndWorkers.DATAPROVIDER]: {
    POSTGRES_PORT: process.env.POSTGRES_PORT || "",
    POSTGRES_PW: process.env.POSTGRES_PW || "",
    POSTGRES_HOST: process.env.POSTGRES_HOST || "",
  },
  [ServicesAndWorkers.ONCHAINLISTENER]: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  [ServicesAndWorkers.FRONTEND]: {},

  [ServicesAndWorkers.INTEGRATIONFRNTD]: {},

  [ServicesAndWorkers.INTEGRATIONPRVDR]: {
    POSTGRES_PORT: process.env.POSTGRES_PORT || "",
    POSTGRES_PW: process.env.POSTGRES_PW || "",
    POSTGRES_HOST: process.env.POSTGRES_HOST || "",
  },

  [ServicesAndWorkers.OFFCHAINACTIONS]: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  },

  [ServicesAndWorkers.STRATEGYBUILDER]: {
    POSTGRES_PORT: process.env.POSTGRES_PORT || "",
    POSTGRES_PW: process.env.POSTGRES_PW || "",
    POSTGRES_HOST: process.env.POSTGRES_HOST || "",
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",
    ARBISCAN_API_KEY: process.env.ARBISCAN_API_KEY || "",
  },

  [ServicesAndWorkers.SQSORCHESTRATOR]: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

const ecrRepos: { [key in ServicesAndWorkers]?: RepoSettings } = {
  [ServicesAndWorkers.ONCHAINLISTENER]: {
    id: "ONCHAINLISTENERECRRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/onchain-listener",
  },
  [ServicesAndWorkers.FRONTEND]: {
    id: "FRONTENDRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/frontend",
  },
  [ServicesAndWorkers.DATAPROVIDER]: {
    id: "DATAAPROVIDERRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/data-provider",
  },
  [ServicesAndWorkers.INTEGRATIONPRVDR]: {
    id: "INTEGRATIONPRVDRRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/integration-provider",
  },
  [ServicesAndWorkers.INTEGRATIONFRNTD]: {
    id: "INTEGRATIONFRNTDRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/integration-frontend",
  },
  [ServicesAndWorkers.OFFCHAINACTIONS]: {
    id: "OFFCHAINACTIONSRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/offchain-actions",
  },
  [ServicesAndWorkers.STRATEGYBUILDER]: {
    id: "STRATEGYBUILDERRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/strategy-builder",
  },
  [ServicesAndWorkers.SQSORCHESTRATOR]: {
    id: "SQSORCHESTRATORRepo",
    arn: "arn:aws:ecr:us-east-1:010073361729:repository/sqs-orchestrator",
  },
};

export const configs: { [key in ServicesAndWorkers]?: ServiceOrWorkerConfig } =
  {
    [ServicesAndWorkers.DATAPROVIDER]: {
      repoSettings: ecrRepos.DATAPRVDR as RepoSettings,
      ENVs: ENVs.DATAPRVDR as Record<string, string>,
      type: ServiceTypes.SERVICE,
      name: ServicesAndWorkers.DATAPROVIDER,
      subdomain: "api.yieldchain.io",
      portMappings: [...defaultPortMappings.service],
      initialDeployment: true,
    },
    [ServicesAndWorkers.INTEGRATIONPRVDR]: {
      repoSettings: ecrRepos.INTEGRATIONPRVDR as RepoSettings,
      ENVs: ENVs.INTEGRATIONPRVDR as Record<string, string>,
      type: ServiceTypes.SERVICE,
      name: ServicesAndWorkers.INTEGRATIONPRVDR,
      subdomain: "integrationapi.yieldchain.io",
      portMappings: [...defaultPortMappings.service],
      initialDeployment: true,
    },
    [ServicesAndWorkers.INTEGRATIONFRNTD]: {
      repoSettings: ecrRepos.INTEGRATIONFRNTD as RepoSettings,
      ENVs: ENVs.INTEGRATIONFRNTD as Record<string, string>,
      type: ServiceTypes.SERVICE,
      name: ServicesAndWorkers.INTEGRATIONFRNTD,
      subdomain: "admindashboard.yieldchain.io",
      portMappings: [...defaultPortMappings.service],
      initialDeployment: true,
    },
    [ServicesAndWorkers.ONCHAINLISTENER]: {
      repoSettings: ecrRepos.ONCHAINLISTENER as RepoSettings,
      ENVs: ENVs.ONCHAINLISTENER as Record<string, string>,
      type: ServiceTypes.WORKER,
      name: ServicesAndWorkers.ONCHAINLISTENER,
    },
    [ServicesAndWorkers.FRONTEND]: {
      repoSettings: ecrRepos.FRONTEND as RepoSettings,
      ENVs: ENVs.FRONTEND as Record<string, string>,
      type: ServiceTypes.SERVICE,
      name: ServicesAndWorkers.FRONTEND,
      portMappings: [...defaultPortMappings.service],
      subdomain: "yieldchain.io",
    },
    [ServicesAndWorkers.SQSORCHESTRATOR]: {
      repoSettings: ecrRepos.SQSORCHESTRATOR as RepoSettings,
      ENVs: ENVs.SQSORCHESTRATOR as Record<string, string>,
      type: ServiceTypes.WORKER,
      name: ServicesAndWorkers.SQSORCHESTRATOR,
    },
    [ServicesAndWorkers.OFFCHAINACTIONS]: {
      repoSettings: ecrRepos.OFFCHAINACTIONS as RepoSettings,
      ENVs: ENVs.OFFCHAINACTIONS as Record<string, string>,
      type: ServiceTypes.WORKER,
      name: ServicesAndWorkers.OFFCHAINACTIONS,
    },
    [ServicesAndWorkers.STRATEGYBUILDER]: {
      repoSettings: ecrRepos.STRATEGYBUILDER as RepoSettings,
      ENVs: ENVs.STRATEGYBUILDER as Record<string, string>,
      type: ServiceTypes.SERVICE,
      name: ServicesAndWorkers.STRATEGYBUILDER,
      portMappings: [...defaultPortMappings.service],
      subdomain: "builderapi.yieldchain.io",
    },
  };
