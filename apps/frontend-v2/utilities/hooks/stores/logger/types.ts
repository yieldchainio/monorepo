export interface UserLog {
  component: React.ReactNode;
  lifespan: number | "immortal" | Promise<any>;
  id: string;
  data: any;
}
// The interface for this store
export interface LogsStore {
  id: string;
  logs: UserLog[];
  push: (logCallback: (id: string) => UserLog) => void;
  remove: (id: string) => void;
  destroy: () => void;
  map: (
    logCallback: (item: UserLog, index: number, arr: UserLog[]) => any
  ) => any;
  lazyPush: ({
    message,
    data = {},
    lifespan = 2000,
    type = "info",
  }: {
    message: string;
    data?: any;
    lifespan?: number | Promise<any>;
    type?: "info" | "error" | "warning" | "success";
  }) => string;

  throwError: (msg: string, lifespan?: number | Promise<any>) => void;
}
