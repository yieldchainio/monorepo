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
    axios.get(baseApi + "/v2/addresses"),
    axios.get(baseApi + "/v2/functions"),
    axios.get(baseApi + "/v2/tokens"),
    axios.get(baseApi + "/v2/parameters"),
    axios.get(baseApi + "/v2/flows"),
    axios.get(baseApi + "/v2/protocols"),
    axios.get(baseApi + "/v2/strategies"),
    axios.get(baseApi + "/v2/networks"),
    axios.get(baseApi + "/v2/actions"),
    axios.get(baseApi + "/v2/users"),
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
