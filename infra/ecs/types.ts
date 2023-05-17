export interface RepoSettings {
  id: string;
  arn: string;
}

export enum ServiceTypes {
  WORKER = "WORKER",
  SERVICE = "SERVICE",
}
