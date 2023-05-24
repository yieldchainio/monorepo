import {
  FargateTaskDefinition,
  FargateTaskDefinitionProps,
} from "aws-cdk-lib/aws-ecs";
import { Role, IRole, RoleProps } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { App, Stack } from "aws-cdk-lib";

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
    props: FargateTaskDefinitionProps & { taskRole: IRole }
  ) {
    props = {
      ...defaultTaskDef,
      ...props,
      taskRole: props.taskRole,
      family: id,
    };
    super(scope, id, props);
  }
}
