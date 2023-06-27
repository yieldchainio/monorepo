/**
 * Get the deployment data from the builder
 *
 */

import { BuilderRequestBody, BuilderResponse, JSONStep } from "@yc/yc-models";
import axios from "axios";

export async function getDeploymentData(
  req: BuilderRequestBody,
  logger?: (msg: string) => void
): Promise<{
  uprootSteps: JSONStep;
  deploymentCalldata: string;
} | null> {
  try {
    const res = await axios.post<BuilderResponse>(
      "https://builder.yieldchain.io/strategy-creation-data",
      req
    );
    console.log("Res", res);
    if (res.data.status) {
      return {
        deploymentCalldata: res.data.deploymentCalldata,
        uprootSteps: res.data.uprootSteps,
      };
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

  return null;
}
