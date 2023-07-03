// ============
//   IMPORTS
// ============
import dotenv from "dotenv";
dotenv.config();
import { YCClassifications } from "@yc/yc-models";
import { AbiCoder } from "ethers";
import { execOffchainAction } from "./utils/exec-offchain-action.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// ============
//   SETUP
// ============
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const ycContext = YCClassifications.getInstance();
if (!ycContext.initiallized)
    await ycContext.initiallize();
// ============
//   HANDLERS
// ============
async function ccipRequestHandler(actionRequest) {
    const network = ycContext.getNetwork(actionRequest.chainId);
    if (!network || !network.diamondAddress || !network.provider)
        return {
            status: 404,
            message: "Network With Chain ID " + actionRequest.chainId + " Not Supported",
        };
    try {
        const res = await execOffchainAction(actionRequest, network.provider);
        console.log("Res SEr!!", res);
        if (!res)
            return {
                status: 404,
                message: "Failed To Fetch Offchain Action Data",
            };
        const offchainCommands = [
            ...actionRequest.cachedOffchainCommands,
            res,
        ];
        console.log("Gonna return these offchain commands", offchainCommands);
        return {
            status: 200,
            data: AbiCoder.defaultAbiCoder().encode(["bytes[]"], [offchainCommands]),
        };
    }
    catch (e) {
        console.error("Caught An Error While Handling Offchain Action:", e);
        return {
            status: 404,
            message: "Failed To Fetch Offchain Action Data",
        };
    }
}
// ============
//   ENDPOINTS
// ============
app.get("/", (req, res) => {
    res.status(200).json({ status: "OK" });
});
app.get("/offchain-actions/:callData", async (req, res) => {
    try {
        const offchainRequest = AbiCoder.defaultAbiCoder().decode([
            "tuple(address initiator, uint256 chainId, uint256 stepIndex, bytes[] cachedOffchainCommands, address callTargetAddress, string signature, bytes args)",
        ], req.params.callData)[0];
        const data = await ccipRequestHandler(offchainRequest);
        res.status(data.status).json(data);
    }
    catch (e) {
        res.status(404).json({
            status: 404,
            message: e,
        });
    }
});
app.listen(PORT, () => console.log("Offchain Actions Listening On Port", PORT + "..."));
//# sourceMappingURL=index.js.map