/**
 * Get the deployment data from the builder
 *
 */

import { BuilderRequestBody, BuilderResponse } from "@yc/yc-models";
import axios from "axios";

export async function getDeploymentData(
  req: BuilderRequestBody,
  logger?: (msg: string) => void
) {
  try {
    const res = await axios.post<BuilderResponse>(
      "http://localhost:8080/strategy-creation-data",
      req
    );
    if (res.data.status) {
      logger?.("Submit The Deployment Transaction In Your Wallet...");
      return res.data.deploymentCalldata;
    }
    return null;
  } catch (e: any) {
    console.log(e);
    const err = e as {
      message: string;
      response: { data: { status: boolean; reason: string } };
    };
    logger?.(err.response.data.reason);
  }
}
