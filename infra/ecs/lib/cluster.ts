import cdk = require("aws-cdk-lib");
import { Cluster, ICluster } from "aws-cdk-lib/aws-ecs";
import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

/**
 * @notice
 * YCECSCluster
 * A class representing an ECS Cluster - With some abstraction.
 * Takes in an optional ICluster typed object, uses the default YC ECS Cluster if non was provided
 */
export class YCECSCluster {
  // Static Cluster Field
  static #ecsCluster: ICluster;

  // ID
  readonly ID: string;

  // Scope
  readonly scope: Construct;

  readonly vpc: IVpc;

  // Default singleton if no cluster was provided
  constructor(scope: Construct, props?: cdk.StackProps) {
    const id: string = "YCECSClusterB729975E";

    // Assign read vars
    this.ID = id;
    this.scope = scope;

    if (!YCECSCluster.#ecsCluster) {
      // VPC
      const vpc = new Vpc(scope, "YCECSVpc", {
        vpcName: "YCECSVpc",
      });

      this.vpc = vpc;

      YCECSCluster.#ecsCluster = new Cluster(scope, "YCECSClusterB729975E", {
        clusterName: "YC-Cluster",
        vpc: vpc,
      });
    }
  }

  // Retreive the ICluster interface of the current cluster
  get cluster(): ICluster {
    // Either return the default cluster or the custom one
    return YCECSCluster.#ecsCluster;
  }
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
