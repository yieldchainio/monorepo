import { ClassificationContext } from "@yc/yc-models";
import axios from "axios";

export const fetchYC = async (
  version: DataVersions
): Promise<ClassificationContext> => {
  const baseApi = "https://api.yieldchain.io";

  const [
    _addresses,
    _funcs,
    _tokens,
    _parameters,
    _flows,
    _protocols,
    _strategies,
    _networks,
    _actions,
    _users,
  ] = await Promise.all([
    axios.get(baseApi + "/addresses"),
    axios.get(baseApi + "/functions"),
    axios.get(baseApi + "/tokens"),
    axios.get(baseApi + "/parameters"),
    axios.get(baseApi + "/flows"),
    axios.get(baseApi + "/protocols"),
    axios.get(baseApi + "/strategies"),
    axios.get(baseApi + "/networks"),
    axios.get(baseApi + "/actions"),
    axios.get(baseApi + "/users"),
  ]);

  // Set all of the DB info
  const addresses = _addresses.data.addresses;
  const funcs = _funcs.data.functions;
  const tokens = _tokens.data.tokens;
  const parameters = _parameters.data.parameters;
  const flows = _flows.data.flows;
  const protocols = _protocols.data.protocols;
  const strategies = _strategies.data.strategies;
  const networks = _networks.data.networks;
  const actions = _actions.data.actions;
  const users = _users.data.users;

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
