import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createDeployableVaultInput } from "./helpers";
const prisma = new PrismaClient();
// App to use for reguler API
const app = express();
// Setup parsers & Cors settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Port for reguler app
let PORT = 8080;
/**
 * @notice
 * Request the calldata for creating a new vault through the factory
 * @request VaultCreationRequest - The details required to build the calldata
 * @return deploymentCalldata - Deployment to call on the diamond factory
 */
app.post("/strategy-creation-data", async (req, res, next) => {
    if (Object.values(req.body).some((field) => field == null))
        res
            .status(400)
            .json({ status: false, reason: "Insufficient Arguments Provided" });
    const builderResult = await createDeployableVaultInput(req.body.seedSteps, req.body.treeSteps, req.body.vaultVisibility, req.body.depositTokenID, req.body.chainID);
    res.status(builderResult.status == true ? 200 : 400).json(builderResult);
});
app.get("/", async (req, res) => {
    res.status(200).send("ur mum");
});
/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
//# sourceMappingURL=index.js.map