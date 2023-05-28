/**
 * Add a strategy to the database
 * @param strategy - Strategy classification object
 * @return addedOrReason - true or a string reason
 */

import {
  StrategyClassificationRequestBody,
  StrategyClassificationResponse,
} from "@yc/yc-models";
import axios from "axios";
import { AxiosResponse } from "axios";

export async function addStrategy(
  strategy: StrategyClassificationRequestBody
): Promise<true | string> {
  const res = await axios.post<
    StrategyClassificationResponse,
    AxiosResponse<StrategyClassificationResponse>,
    StrategyClassificationRequestBody
  >("http://localhost:8080/add-strategy", strategy);

  return res.data.status ? res.data.status : res.data.reason;
}
