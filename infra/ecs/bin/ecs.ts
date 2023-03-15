// #!/usr/bin/env node

// ======================
//        IMPORTS
// ======================
// Global imports
import * as dotenv from "dotenv";
dotenv.config();
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { deploy, isServiceConfig } from "./utils";
import { configs } from "../services/configs";

/**
 * @notice
 * Deploy @ALL Services
 */
// Initiate cdk.App() as the scope for the deployment
const app = new cdk.App();

// Iterate over each service and deploy them
for (const serviceOrWorker of Object.values(configs)) {
  // Check if it's a service / worker
  const issserviceconfig = isServiceConfig(serviceOrWorker);

  // Call corresponding function for deployment
  deploy(app, serviceOrWorker);
}
