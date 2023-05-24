/**
 * The ECS service deployer
 */

import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  IServiceConfig,
  ServiceOrWorkerConfig,
  ServicesStrengthsConfigs,
} from "../services/configtypes";
import { YCECSCluster } from "./cluster";
import { ISecurityGroup, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { defaultPortMappings, defaultSecurityGroup } from "./utils";
import { YCFargateService } from "./service";
import FargateTaskDef from "./task-def";
import { IRepository, Repository } from "aws-cdk-lib/aws-ecr";
import { AwsLogDriver, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { Role } from "aws-cdk-lib/aws-iam";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { hostedZoneId, zoneName } from "./constants";

export class YCECSDeployer extends Stack {
  constructor(
    scope: Construct,
    services: ServiceOrWorkerConfig[],
    props?: StackProps
  ) {
    super(scope, "YC-Cluster", {
      ...props,
      stackName: "YC-Cluster",
    });

    const cluster = new YCECSCluster(this, props);

    const serviceSecurityGroups: ISecurityGroup[] = [
      new SecurityGroup(this, "YCECSDefaultSecurityServiceGroup", {
        vpc: cluster.vpc,
      }),
    ];

    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "YieldchainIOHostedZone",
      {
        hostedZoneId,
        zoneName,
      }
    );

    for (const serviceConfig of services) {
      // Repository that holds our image
      const ecrRepo: IRepository = Repository.fromRepositoryArn(
        this,
        serviceConfig.repoSettings.id,
        serviceConfig.repoSettings.arn
      );

      // The Container Image
      const containerImage = ContainerImage.fromEcrRepository(
        ecrRepo,
        "latest"
      );

      const taskID = `${serviceConfig.name}-TASKDEF`;

      const taskRole = Role.fromRoleArn(
        this,
        taskID + "Role",
        "arn:aws:iam::010073361729:role/FullAuthRole"
      );

      const taskDefinition = new FargateTaskDef(this, taskID, {
        taskRole,
        ...ServicesStrengthsConfigs[serviceConfig.requiredStrength],
      });

      taskDefinition.addContainer(`${serviceConfig.name}-CONTAINER`, {
        image: containerImage,
        environment: serviceConfig.ENVs,
        portMappings: isServiceConfig(serviceConfig)
          ? serviceConfig.portMappings || defaultPortMappings.service
          : defaultPortMappings.worker,
        logging: new AwsLogDriver({
          streamPrefix: `${serviceConfig.name}-STREAM`,
        }),
      });

      new YCFargateService(
        this,
        `${serviceConfig.name}-${serviceConfig.type}`,
        (serviceConfig as IServiceConfig)?.subdomain || "",
        serviceConfig.type,
        taskDefinition,
        cluster.cluster,
        {
          securityGroups: serviceSecurityGroups,
          hostedZone,
        }
      );
    }
  }
}

export const isServiceConfig = (object: any): object is IServiceConfig => {
  return "subdomain" in object;
};
