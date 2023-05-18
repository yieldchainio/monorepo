import net from "net";
const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
        let port = startPort;
        let server = net.createServer();
        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
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
export default findAvailablePort;
//# sourceMappingURL=find-available-port.js.map