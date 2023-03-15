import { IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import { AwsLogDriver, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { AwsCliLayer } from "aws-cdk-lib/lambda-layer-awscli";
import { Construct } from "constructs";
import { YCECSCluster } from "../lib/cluster";
import { defaultPortMappings } from "../lib/utils";
import FargateTaskDef from "../lib/task-def";
import {
  IServiceConfig,
  IWorkerConfig,
  ServiceOrWorkerConfig,
} from "../services/configtypes";
import { ServiceTypes } from "../types";

/**
 * @notice
 * both deployService and deployWorker @uses deploy()
 */
export const deploy = (
  scope: Construct,
  serviceConfig: ServiceOrWorkerConfig
) => {
  // init cluster
  const cluster = new YCECSCluster(scope, `${serviceConfig.name}-Stack`);

  // Repository that holds our image
  const ecrRepo: IRepository = Repository.fromRepositoryArn(
    cluster,
    serviceConfig.repoSettings.id,
    serviceConfig.repoSettings.arn
  );

  // The Container Image
  const containerImage = ContainerImage.fromEcrRepository(ecrRepo, "latest");

  // Task Definition
  const tasDef = new FargateTaskDef(cluster, `${serviceConfig.name}-TASKDEF`);

  // Add a container
  // Add our container to the task definition
  tasDef.addContainer(`${serviceConfig.name}-CONTAINER`, {
    image: containerImage,
    environment: serviceConfig.ENVs,
    portMappings: isServiceConfig(serviceConfig)
      ? serviceConfig.portMappings || defaultPortMappings.service
      : defaultPortMappings.worker,
    logging: new AwsLogDriver({ streamPrefix: `${serviceConfig.name}-STREAM` }),
  });

  // Deploy
  if (isServiceConfig(serviceConfig))
    cluster.newService(
      `${serviceConfig.name}-SERVICE`,
      tasDef,
      serviceConfig.subdomain || ""
    );
  else if (serviceConfig.type == ServiceTypes.WORKER)
    cluster.newWorker(`${serviceConfig.name}-WORKER`, tasDef);
};

// Checks if an object is a Service
export const isServiceConfig = (object: any): object is IServiceConfig => {
  return "subdomain" in object;
};
