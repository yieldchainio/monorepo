import net from "net";
export const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
        let port = startPort;
        let server = net.createServer();
        server.on("error", (err) => {
            if (err.message === "EADDRINUSE" || err.code == "EADDRINUSE") {
                server.close();
                findAvailablePort(port + 1)
                    .then(resolve)
                    .catch(reject);
            }
            else {
                reject(err);
            }
        });
        server.listen(port, () => {
            server.close();
            resolve(port);
        });
    });
};
//# sourceMappingURL=find-available-port.js.map