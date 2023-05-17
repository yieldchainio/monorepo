import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  FargateTaskDefinition,
  FargateService,
  ICluster,
  FargateServiceProps,
} from "aws-cdk-lib/aws-ecs";
import {
  Protocol,
  ListenerCertificate,
  ApplicationLoadBalancer,
  ApplicationTargetGroup,
  ApplicationProtocol,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { ServiceTypes } from "../types";
import { ISecurityGroup } from "aws-cdk-lib/aws-ec2";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { aws_route53_targets } from "aws-cdk-lib";
import { subdomainsToSSLCertificateARNs } from "./utils";

/**
 * @notice
 * A class representing a Yieldchain Fargate service on ECS.
 * (It can represent both a worker/a service as needed)
 */
export class YCFargateService extends FargateService {
  // =======================
  //     PRIVATE FIELDS
  // =======================
  // Our load balancer
  #loadbalancer: ApplicationLoadBalancer;

  // Type (Service/Worker)
  #type: ServiceTypes;

  // Scope
  #scope: Construct;

  // ID
  #id: string;

  constructor(
    scope: Construct,
    id: string,
    subdomain: string,
    serviceType: ServiceTypes,
    taskDef: FargateTaskDefinition,
    cluster: ICluster,
    props: Partial<FargateServiceProps> & {
      securityGroups: ISecurityGroup[];
      hostedZone: IHostedZone;
    },
    _targetGroups?: string[],
    ports?: number[]
  ) {
    // Shorthand for desired count (used multiple times)
    const desiredCount = props?.desiredCount || 2;

    // Super the construction details
    super(scope, id, {
      taskDefinition: taskDef,
      cluster: cluster,
      desiredCount: desiredCount,
      securityGroups: props.securityGroups,
      serviceName: id,
      enableECSManagedTags: true,
    });

    // Set static
    this.#scope = scope;
    this.#type = serviceType;
    this.#id = id;

    // Setup autoscaling
    // TODO: Configure this
    const scaling = this.autoScaleTaskCount({
      minCapacity: desiredCount,
      maxCapacity: desiredCount * 3,
    });

    /**
     * @notice
     *  If the service type is a "Service" (i.e consumed by others, not standalone),
     *  we create a load balancer for it
     */
    if (serviceType == ServiceTypes.SERVICE) {
      // Ports to listen on
      const portsToListenOn = ports || [8080];

      // create Application Load Balancer that is internet facing, within the same VPC as our cluster,
      // or use the existing one
      const loadBalancer: ApplicationLoadBalancer = new ApplicationLoadBalancer(
        this,
        `YC-${id}-ALB`,
        {
          vpc: cluster.vpc,
          internetFacing: true,
          loadBalancerName: `YC-${id}-LB`,
          securityGroup: props.securityGroups[0],
        }
      );

      // Set global variable
      this.#loadbalancer = loadBalancer;

      // @notice
      // Create the target group that points to this service
      const targetGroup: ApplicationTargetGroup = new ApplicationTargetGroup(
        scope,
        `YC-${id}-TG`,
        {
          port: 8080,
          protocol: ApplicationProtocol.HTTP,
          targets: [this],
          healthCheck: {
            protocol: Protocol.HTTP,
            healthyHttpCodes: "200", // Considered healthy if 200 is returned
            path: "/",
          },
          vpc: cluster.vpc,
        }
      );

      // @notice
      // Load a subdomain certificate if needed
      // Can be null if no subdomain was provided
      const certificate: ListenerCertificate | null = subdomain
        ? ListenerCertificate.fromArn(subdomainsToSSLCertificateARNs[subdomain])
        : null;

      // Add an HTTP listener
      loadBalancer.addListener(`YC-${id}-HTTPLISTENER`, {
        port: 80,
        defaultTargetGroups: [targetGroup],
        protocol: ApplicationProtocol.HTTP,
      });

      // Add an HTTPs listener
      loadBalancer.addListener(`YC-${id}-HTTPSLISTENER`, {
        port: 443,
        defaultTargetGroups: [targetGroup],
        protocol: ApplicationProtocol.HTTPS,
        certificates: certificate ? [certificate] : undefined,
      });

      // If we got a subdomain, we assign a new record to the hosted zone to match our LB
      if (subdomain) this.setSubDomain(subdomain, props.hostedZone);
    }
  }

  /**
   * @notice
   * @method
   * Call this method to bind this service's load balancer to a sub domain
   * @param subdomainName - the name of the subdomain to bind to yieldchain.io (e.g for foo.yieldchain.io, insert "foo")
   */
  setSubDomain = (subdomainName: string, zone: IHostedZone) => {
    // If the service is a worker, we cannot allow the binding of a subdomain (it is isolated and therefore does not have a LB,
    // and is not supposed to be accessed through a URL)
    if (this.#type == ServiceTypes.WORKER)
      throw new Error(
        "YCFargateService ERR: Cannot assign subdomain to service of type WORKER - Workers are meant to be isolated."
      );

    // The SSL certificate we want
    const cert = [
      { certificateArn: subdomainsToSSLCertificateARNs[subdomainName] },
    ];

    // Throw an error if we did not find a certificate
    if (!cert[0].certificateArn)
      throw new Error(
        "YCFargateService ERR: Cannot find certificate of provided subdomain: " +
          subdomainName
      );

    const recordTarget = RecordTarget.fromAlias(
      new aws_route53_targets.LoadBalancerTarget(this.#loadbalancer)
    );
    // Create the new A record with the subdomain, pointing to the service's load balancer
    new ARecord(this.#scope, `${subdomainName}_ALB_RECORD`, {
      target: RecordTarget.fromAlias(
        new aws_route53_targets.LoadBalancerTarget(this.#loadbalancer)
      ),
      zone,
      recordName: subdomainName,
    });
  };
}
