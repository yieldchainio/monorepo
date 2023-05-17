// #!/usr/bin/env node

// ======================
//        IMPORTS
// ======================
// Global imports
import * as dotenv from "dotenv";
dotenv.config();
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { configs } from "../services/configs";
import { YCECSDeployer } from "../lib/deployer";

/**
 * @notice
 * Deploy @ALL Services
 */

const props: cdk.StackProps = {
  env: {
    account: "010073361729",
    region: "us-east-1",
  },
};

// Initiate cdk.App() as the scope for the deployment
const app = new cdk.App(props);

// Deploy all services
new YCECSDeployer(app, Object.values(configs), props);
