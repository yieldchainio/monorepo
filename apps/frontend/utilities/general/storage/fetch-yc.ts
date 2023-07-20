import { ClassificationContext } from "@yc/yc-models";
import axios from "axios";

export const fetchYC = async (
  version?: DataVersions
): Promise<ClassificationContext> => {
  const baseApi = "https://api.yieldchain.io";

  const [
    _addresses,
    _funcs,
    _tokens,
    _parameters,
    _protocols,
    _strategies,
    _networks,
    _actions,
    _users,
    _statistics,
    _tiers,
  ] = await Promise.all([
    fetch(baseApi + "/v2/addresses", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/functions", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/tokens", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/parameters", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/protocols", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/strategies", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/networks", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/actions", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/users", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/statistics", {
      cache: "no-store",
    }),
    fetch(baseApi + "/v2/tiers", {
      cache: "no-store",
    }),
  ]);

  // Set all of the DB info
  const addresses = (await _addresses.json()).addresses;
  const funcs = (await _funcs.json()).functions;
  const tokens = (await _tokens.json()).tokens;
  const parameters = (await _parameters.json()).parameters;
  const protocols = (await _protocols.json()).protocols;
  const strategies = (await _strategies.json()).strategies;
  const networks = (await _networks.json()).networks;
  const actions = (await _actions.json()).actions;
  const users = (await _users.json()).users;
  const statistics = (await _statistics.json()).statistics;
  const tiers = (await _tiers.json()).tiers;

  return {
    addresses,
    protocols,
    networks,
    strategies,
    actions,
    funcs,
    users,
    parameters,
    tokens,
    statistics,
    tiers,
  };
};

export enum DataVersions {
  V1,
  V2,
}
