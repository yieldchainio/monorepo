import dotenv from "dotenv";
dotenv.config();
import express, { Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { VaultCreationRequest } from "./types";

const prisma = new PrismaClient();

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
  async (req: VaultCreationRequest, res: any, next: any) => {
    //
    // Verify the strategy on etherscan

    res.status(200).json({});
  }
);

app.get("/", async (req: any, res: any) => {
  res.status(200).send("ur mum");
});
/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
