import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
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
 * @dev
 * @notice
 * Queries From The Database Server
 */
app.get("/", async (req, res) => {
    res.status(200).send("Wassup Brah");
});
// ======================
//      V2 ENDPOINTS
// ======================
app.get("/v2", async (req, res) => {
    res.status(200).send("Wassup Brah");
});
/**
 * @dev Tokens (e.g. DAI, USDC, etc...)
 */
app.get("/v2/tokens", async (req, res) => {
    const tokens = await prisma.tokensv2.findMany();
    res.status(200).json({ tokens });
});
/**
 * @dev Networks (e.g. Ethereum, Binance, etc...)
 */
app.get("/v2/networks", async (req, res) => {
    const networks = await prisma.networksv2.findMany();
    res.status(200).json({ networks });
});
/**
 * @dev Strategies made by users.
 */
app.get("/v2/strategies", async (req, res) => {
    // @ts-ignore
    const strategies = await prisma.strategiesv2.findMany(); // TODO: Change strategiesv2 token id to string, migrate
    res.status(200).json({ strategies });
});
/**
 * @dev Protocols (e.g. Aave, Yearn, etc...)
 */
app.get("/v2/protocols", async (req, res) => {
    const protocols = await prisma.protocolsv2.findMany();
    res.status(200).json({ protocols });
});
/**
 * @dev Addresses (e.g. 0x1234...),
 */
app.get("/v2/addresses", async (req, res) => {
    const addresses = await prisma.addressesv2.findMany();
    res.status(200).json({ addresses });
});
/**
 * @dev Parameters/Arguments to use in raw function calls
 */
app.get("/v2/parameters", async (req, res) => {
    const parameters = await prisma.argumentsv2.findMany();
    res.status(200).json({ parameters });
});
/**
 * @dev Users (e.g. Ofir, Eden, etc...)
 */
app.get("/v2/users", async (req, res) => {
    const users = await prisma.usersv2.findMany();
    res.status(200).json({ users });
});
/**
 * @dev Functions (raw function classifications)
 */
app.get("/v2/functions", async (req, res) => {
    const functions = await prisma.functionsv2.findMany();
    res.status(200).json({ functions });
});
/**
 * @dev statistics about strategies (apy, gas fees in timestamps. To generate charts and etc)
 */
app.get("/v2/statistics", async (req, res) => {
    const statistics = await prisma.statistics.findMany();
    res.status(200).json({ statistics });
});
/**
 * @dev Actions (e.g Stake, Swap, Harvest, Add Liquidity...),
 */
app.get("/v2/actions", async (req, res) => {
    const actions = await prisma.actionsv2.findMany();
    res.status(200).json({ actions });
});
app.post("/signup", async (req, res) => {
    const data = req.body;
    if (await prisma.usersv2.findFirst({
        where: {
            address: {
                equals: data.address,
                mode: "insensitive",
            },
        },
    }))
        res.status(400).send("USER ALREADY EXISTS");
    const result = await prisma.usersv2.create({
        data: {
            address: data.address,
            username: data.username || "Anon",
            description: data.description,
            twitter: data.twitter,
            telegram: data.telegram,
            discord: data.discord,
            profile_picture: data.profilePicture,
        },
    });
    if (result)
        res.status(200).json({ user: data });
    else
        res.status(400);
});
app.post("/update-user", async (req, res) => {
    const data = req.body;
    const result = await prisma.usersv2.update({
        where: {
            id: data.id,
        },
        data: {
            username: data.username,
            description: data.description,
            twitter: data.twitter,
            telegram: data.telegram,
            discord: data.discord,
            profile_picture: data.profile_picture,
        },
    });
    if (result)
        res.status(200).json({ user: data });
    else
        res.status(400);
});
app.get("/ccip-test/:callData", async (req, res) => {
    const callData = req.params.callData;
    res.status(200).json({
        data: callData +
            "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    });
});
// ====================
//        YCAPI
// ====================
app.listen(PORT, () => console.log(`YC API is running on port ${PORT}`));
//# sourceMappingURL=index.js.map