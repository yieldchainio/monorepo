import cdk = require("aws-cdk-lib");
import {
  AsgCapacityProvider,
  Cluster,
  FargateService,
  FargateTaskDefinition,
  ICluster,
  IFargateService,
} from "aws-cdk-lib/aws-ecs";
import { ISecurityGroup, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { newService, YCFargateService } from "./service";
import { RepoSettings } from "./types";
import { ServiceTypes } from "./types";
import { CfnWaitCondition, CfnWaitConditionHandle } from "aws-cdk-lib";

/**
 * @notice
 * YCECSCluster
 * A class representing an ECS Cluster - With some abstraction.
 * Takes in an optional ICluster typed object, uses the default YC ECS Cluster if non was provided
 */
export class YCECSCluster extends cdk.Stack {
  // Static Cluster Field
  static #ecsCluster: Cluster;

  // ID
  readonly ID: string;

  // Custom cluster - if provided, will be set
  #customCluster: ICluster | null = null;

  // Scope
  readonly scope: Construct;

  // Default singleton if no cluster was provided
  constructor(
    scope: Construct = new cdk.App(),
    id: string = "YCCluster",
    _cluster?: ICluster,
    props?: cdk.StackProps
  ) {
    super(scope, id, {
      ...props,
      env: {
        account: "010073361729",
        region: "us-east-1",
      },
    });

    // Security groups
    const defaultSecurityGroups: ISecurityGroup[] = [
      SecurityGroup.fromSecurityGroupId(
        this,
        "YCECSDefaultSecurityGroup",
        "sg-06dbb6d3a2f7fa1a9"
      ),
    ];

    // Assign read vars
    this.ID = id;
    this.scope = scope;

    // If we got a custom cluster, customCluster will be set to it - and cluster() method will return the custom one instead of the default static one
    if (_cluster) {
      this.#customCluster = _cluster;
      return this;
    }

    // @notice
    // Else, if we did not assign the static singleton instance yet - we set it
    if (!YCECSCluster.#ecsCluster) {
      // VPC
      const vpc = Vpc.fromLookup(this, "YCECSVpc", {
        region: "us-east-1",
        vpcId: "vpc-0c485efe3b14f9196",
      });

      YCECSCluster.#ecsCluster = new Cluster(this, "YCECSCluster", { vpc });

      // // Instantiate cluster
      // YCECSCluster.#ecsCluster = Cluster.fromClusterAttributes(
      //   this,
      //   "YCECSCluster",
      //   {
      //     clusterName: "YC-Cluster",
      //     clusterArn: "arn:aws:ecs:us-east-1:010073361729:cluster/YC-Cluster",
      //     vpc: vpc,
      //     securityGroups: defaultSecurityGroups,
      //   }
      // );
    }
  }

  // Retreive the ICluster interface of the current cluster
  cluster = (): ICluster => {
    // Either return the default cluster or the custom one
    return this.#customCluster || YCECSCluster.#ecsCluster;
  };

  // @notice
  // Deploy a new Fargate service
  newService = (
    id: string,
    taskDef?: FargateTaskDefinition,
    subDomain?: string,
    props?: cdk.StackProps
  ): YCFargateService => {
    return newService(
      this,
      id,
      subDomain,
      ServiceTypes.SERVICE,
      this.cluster(),
      taskDef,
      props
    );
  };

  // @notice
  // Deploy a new worker Fargate 'service'
  newWorker = (
    id: string,
    taskDef?: FargateTaskDefinition,
    props?: cdk.StackProps
  ) => {
    return newService(
      this,
      id,
      "",
      ServiceTypes.WORKER,
      this.cluster(),
      taskDef,
      props
    );
  };

  // Retreive an existing Fargate Service
  getService = (_id: string, _arn: string): IFargateService => {
    return FargateService.fromFargateServiceArn(this.scope, _id, _arn);
  };
}

/**
 * @notice
 * used to deploy a completely new cluster
 */
export class ClusterDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new Cluster(this, "YCECSCluster", { clusterName: "YC-Cluster" });
  }
}
