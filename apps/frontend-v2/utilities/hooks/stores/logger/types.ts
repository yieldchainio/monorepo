import { AWSLogger } from "@yc/aws-models/bin/logger";
export interface UserLog {
  component: React.ReactNode;
  lifespan: number | "immortal";
  id: string;
  data: any;
}
// The interface for this store
export interface LogsStore {
  instance: AWSLogger;
  logs: UserLog[];
  push: (logCallback: (id: string) => UserLog) => void;
  remove: (id: string) => void;
  destroy: () => void;
  map: (
    logCallback: (item: UserLog, index: number, arr: UserLog[]) => any
  ) => any;
}
