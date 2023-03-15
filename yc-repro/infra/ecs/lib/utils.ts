/**
 * @notice
 * Default infos that are used by classes, to avoid clutter
 */

import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

// Security groups
export const defaultSecurityGroup = "sg-06dbb6d3a2f7fa1a9";

// ==============================
//     STATIC DEFAULT VALUES
// ==============================

// Enum of all our available subdomains

// Mapping subdomain names to their corresponding SSL Certificate ARN
export const subdomainsToSSLCertificateARNs: Record<string, string> = {
  "api.yieldchain.io":
    "arn:aws:acm:us-east-1:010073361729:certificate/db613a68-9aac-453f-b630-6581b5ac6383",
  "integrationapi.yieldchain.io":
    "arn:aws:acm:us-east-1:010073361729:certificate/58b695b0-e6e4-420f-a7e8-712620a3ceda",
  "fork.yieldchain.io":
    "arn:aws:acm:us-east-1:010073361729:certificate/f0c812c3-e9ed-48bf-8696-0e3682a0e076",
  "builderapi.yieldchain.io":
    "arn:aws:acm:us-east-1:010073361729:certificate/cee1a590-35a4-4971-9224-e4175e722802",
    "admindashboard.yieldchain.io": "arn:aws:acm:us-east-1:010073361729:certificate/74f19982-ce03-4686-9863-e8f90feb4bb5",
    "yieldchain.io": "arn:aws:acm:us-east-1:010073361729:certificate/e7cffaaa-f570-4ac2-be09-7a425b6137b4"
};

// Port mappings
interface portMapping {
  containerPort: number;
  hostPort: number;
}

interface IPortMappings {
  service: portMapping[];
  worker: portMapping[];
}

export const defaultPortMappings: IPortMappings = {
  service: [{ containerPort: 8080, hostPort: 8080 }],
  worker: [{ containerPort: 80, hostPort: 80 }],
};

// Get the default route53 hosted zone for yieldchain.io
export const defaultRoute53HostedZone = (scope: Construct) => {
  // yieldchain.io details
  const hostedZoneId = "Z01218335OMCUR3F67FA";
  const zoneName = "yieldchain.io";

  // return yieldchain.io hosted zone
  return HostedZone.fromHostedZoneAttributes(scope, "YieldchainIOHostedZone", {
    hostedZoneId,
    zoneName,
  });
};
