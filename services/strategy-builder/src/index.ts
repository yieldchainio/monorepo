import dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { VaultCreationRequest } from "./types.js";
import { createDeployableVaultInput } from "./helpers/index.js";
import { BuilderResponse } from "@yc/yc-models";

// App to use for reguler API
const app = express();

// Setup parsers & Cors settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Port for reguler app
let PORT: number = 8080;
/**
 * @notice
 * Request the calldata for creating a new vault through the factory
 * @request VaultCreationRequest - The details required to build the calldata
 * @return deploymentCalldata - Deployment to call on the diamond factory
 */

app.post(
  "/strategy-creation-data",
  async (
    req: VaultCreationRequest,
    res: Response<BuilderResponse>,
    next: any
  ) => {
    if (Object.values(req.body).some((field) => field == null))
      res
        .status(400)
        .json({ status: false, reason: "Insufficient Arguments Provided" });

    const builderResult: BuilderResponse = await createDeployableVaultInput(
      req.body.seedSteps,
      req.body.treeSteps,
      req.body.vaultVisibility,
      req.body.depositTokenID,
      req.body.chainID
    );

    console.log("Builder Result:", builderResult)

    res.status(builderResult.status == true ? 200 : 400).json(builderResult);
  }
);

app.get("/", (req: any, res: any) => {
  res.status(200).send("ur mum");
});
/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
