import {
  FargateTaskDefinition,
  FargateTaskDefinitionProps,
} from "aws-cdk-lib/aws-ecs";
import { Role, IRole, RoleProps } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { App, Stack } from "aws-cdk-lib";
/**
 * @Default IAM Role
 */

// TODO: Configure Service-Role (Access to networking and etc), Worker-Role (Access to SQS), executor-role (access to deploy everything)
class DefaultIAMRole {
  #scope: Construct;
  #id: string;
  #arn: string;
  constructor(scope: Construct) {
    this.#scope = scope;
    this.#id = "YCECSIAM";
  }

  role = () => {
    return Role.fromRoleArn(
      this.#scope,
      this.#id + "Role",
      "arn:aws:iam::010073361729:role/FullAuthRole"
    );
  };
}

/**
 * @notice
 * The default task definition to use when a new service is created, if non overriding property is provided
 */
const defaultTaskDef: FargateTaskDefinitionProps = {
  cpu: 256,
  memoryLimitMiB: 512,
  ephemeralStorageGiB: 21,
  family: undefined,
  executionRole: undefined,
  proxyConfiguration: undefined,
  volumes: undefined,
};

/**
 * @notice
 * Class representing a Fargate task definition
 */
export default class FargateTaskDef extends FargateTaskDefinition {
  constructor(
    scope: Construct,
    id: string,
    props: FargateTaskDefinitionProps = {
      ...defaultTaskDef,
    }
  ) {
    const defaultRole = new DefaultIAMRole(scope).role();
    props = {
      ...props,
      taskRole: props.taskRole || defaultRole,
    };
    super(scope, id, props);
  }
}
