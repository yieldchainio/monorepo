/**
 * Utils for the logger hook
 */

import { ErrorMessage } from "components/logger/components/error";
import { InfoMessage } from "components/logger/components/info";
import { SuccessMessage } from "components/logger/components/success";
import { WarningMessage } from "components/logger/components/warning";

/**
 * Getters for different react components (logs like info, warning, error, success)
 */

export function getErrorLog(info: string, id: string) {
  return <ErrorMessage id={id}>{info}</ErrorMessage>;
}

export function getWarningLog(info: string, id: string) {
  return <WarningMessage id={id}>{info}</WarningMessage>;
}

export function getSuccessLog(info: string, id: string) {
  return <SuccessMessage id={id}>{info}</SuccessMessage>;
}
export function getInfoLog(info: string, id: string) {
  return <InfoMessage id={id}>{info}</InfoMessage>;
}
