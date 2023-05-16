import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createDeployableVaultInput } from "./helpers/index.js";
import { PrismaClient } from "@prisma/client";
// App to use for reguler API
const app = express();
const prismaClient = new PrismaClient();
// Setup parsers & Cors settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Hydrate the YC data when initing
// await YCClassifications.getInstance().initiallize();
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
    console.log("Builder Result", builderResult);
    res.status(builderResult.status == true ? 200 : 400).json(builderResult);
});
app.post("/add-strategy", async (req, res) => {
    const requestedStrategy = req.body;
    const existingStrategy = await prismaClient.strategiesv2.findFirst({
        where: {
            address: requestedStrategy.address,
        },
    });
    if (existingStrategy)
        res
            .status(400)
            .json({ status: false, reason: "Strategy Already Exists In Database" });
    try {
        await prismaClient.strategiesv2.create({
            data: {
                id: requestedStrategy.id,
                chain_id: requestedStrategy.chainID,
                seed_steps: requestedStrategy.seedSteps,
                tree_steps: requestedStrategy.treeSteps,
                uproot_steps: requestedStrategy.uprootSteps,
                title: requestedStrategy.title,
                deposit_token_id: requestedStrategy.depositTokenID,
                address: requestedStrategy.address,
                execution_interval: 1000,
                creator_id: requestedStrategy.creatorID,
            },
        });
        res.status(200).json({ status: true });
    }
    catch (e) {
        res.status(400).json({ status: false, reason: e.message });
    }
});
app.get("/", (req, res) => {
    res.status(200).send("ur mum");
});
/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
//# sourceMappingURL=index.js.map