import { inDevEnvironment } from "./is-dev";
export const BUILDER_CREATION_ROUTE = inDevEnvironment
  ? "http://localhost:8080/strategy-creation-data"
  : "https://builder.yieldchain.io/strategy-creation-data";
