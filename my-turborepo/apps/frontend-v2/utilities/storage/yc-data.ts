import { ClassificationContext } from "@yc/yc-models";
import axios from "axios";

export const fetchYC = async (
  version: DataVersions
): Promise<ClassificationContext> => {
  const baseApi = "https://api.yieldchain.io";

  // Set all of the DB info
  const addresses = await (
    await axios.get(baseApi + "/addresses")
  ).data.addresses;
  const funcs = await (await axios.get(baseApi + "/functions")).data.functions;
  const tokens = await (await axios.get(baseApi + "/tokens")).data.tokens;
  const parameters = await (
    await axios.get(baseApi + "/parameters")
  ).data.parameters;
  const flows = await (await axios.get(baseApi + "/flows")).data.flows;
  const protocols = await (
    await axios.get(baseApi + "/protocols")
  ).data.protocols;
  const strategies = await (
    await axios.get(baseApi + "/strategies")
  ).data.strategies;
  const networks = await (await axios.get(baseApi + "/networks")).data.networks;
  const actions = await (await axios.get(baseApi + "/actions")).data.actions;
  const users = await (await axios.get(baseApi + "/users")).data.users;

  return {
    addresses,
    protocols,
    networks,
    strategies,
    actions,
    funcs,
    flows,
    users,
    parameters,
    tokens,
  };
};

export enum DataVersions {
  V1,
  V2,
}
