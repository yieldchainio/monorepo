import net from "net";

export const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let server = net.createServer();

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        server.close();
        findAvailablePort(port + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      server.close();
      resolve(port);
    });
  });
};

