import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
// Instantitate PG Client
const { Client } = pg;
const prisma = new PrismaClient();
// App to use for reguler API
const app = express();
// Setup parsers & Cors settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Port for reguler app
let PORT = 8080;
const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: "OfirYC",
    port: parseInt(process.env.POSTGRES_PORT || "0"),
    password: process.env.POSTGRES_PW || "",
    database: "postgres",
});
client.connect().then(() => console.log("Connected Succesfully"));
const genericQuery = async (_what, _from, _where, _inputs) => {
    return new Promise(function (res, rej) {
        var sql;
        if (_where !== undefined || null) {
            sql = `SELECT ${_what} FROM "Yieldchain".${_from} WHERE ${_where} = ${_inputs}`;
        }
        else {
            sql = `SELECT ${_what} FROM "Yieldchain".${_from}`;
        }
        client.query(sql, (err, rows) => {
            if (!err) {
                res(rows.rows);
            }
            else {
                rej(err.message);
            }
        });
    });
};
const genericPost = async (sql) => {
    client.query(sql, (err, res) => {
        if (!err) {
            console.log("Insertion was successfull");
        }
        else {
            console.log(err.message);
        }
    });
};
const valuesPost = async (sql, values) => {
    client.query(sql, values, (err, res) => {
        if (!err) {
            console.log("Insertion was successfull");
        }
        else {
            console.log(err.message);
        }
    });
};
/**
 * @dev
 * @notice
 * Queries From The Database Server
 */
app.get("/", async (req, res) => {
    res.status(200).send("Wassup Brah");
});
/**
 * @dev Tokens (e.g. DAI, USDC, etc...)
 */
app.get("/tokens", async (req, res) => {
    const tokens = await genericQuery("*", "tokens");
    res.status(200).json({ tokens });
});
/**
 * @dev Networks (e.g. Ethereum, Binance, etc...)
 */
app.get("/networks", async (req, res) => {
    const networks = await genericQuery("*", "networks");
    res.status(200).json({ networks });
});
/**
 * @dev Strategies made by users.
 */
app.get("/strategies", async (req, res) => {
    // @ts-ignore
    const strategies = await genericQuery("*", "strategies");
    res.status(200).json({ strategies });
});
/**
 * @dev Protocols (e.g. Aave, Yearn, etc...)
 */
app.get("/protocols", async (req, res) => {
    const protocols = await genericQuery("*", "protocols");
    res.status(200).json({ protocols });
});
/**
 * @dev Addresses (e.g. 0x1234...),
 */
app.get("/addresses", async (req, res) => {
    const addresses = await genericQuery("*", "addresses");
    res.status(200).json({ addresses });
});
/**
 * @dev Token flows - Token ID & Whether it is an inflow or an outflow (boolean)
 */
app.get("/flows", async (req, res) => {
    const flows = await genericQuery("*", "flows");
    res.status(200).json({ flows });
});
/**
 * @dev Parameters/Arguments to use in raw function calls
 */
app.get("/parameters", async (req, res) => {
    const parameters = await genericQuery("*", "parameters");
    res.status(200).json({ parameters });
});
/**
 * @dev Users (e.g. Ofir, Eden, etc...)
 */
app.get("/users", async (req, res) => {
    const users = await prisma.usersv2.findMany();
    res.status(200).json({ users });
});
/**
 * @dev Functions (raw function classifications)
 */
app.get("/functions", async (req, res) => {
    const functions = await genericQuery("*", "functions");
    res.status(200).json({ functions });
});
/**
 * @dev Actions (e.g Stake, Swap, Harvest, Add Liquidity...),
 */
app.get("/actions", async (req, res) => {
    const actions = await genericQuery("*", "actions");
    res.status(200).json({ actions });
});
/**
 * @dev Relations between protocols and addresses. (protocol_identifier => address_identifier)
 */
app.get("/protocols-addresses", async (req, res) => {
    const protocols_addresses = await genericQuery("*", "protocols_addresses");
    res.status(200).json({ protocols_addresses });
});
/**
 * @dev Relations between protocols and networks. (protocol_identifier => chain_id)
 */
app.get("/protocols-networks", async (req, res) => {
    const protocols_networks = await genericQuery("*", "protocols_networks");
    res.status(200).json({ protocols_networks });
});
/**
 * @dev Relations between address (address_identifier => address_identifier).
 */
app.get("/address-relations", async (req, res) => {
    const address_relations = await genericQuery("*", "address_relations");
    res.status(200).json({ address_relations });
});
app.get("/address-flows/:address_id", async (req, res) => {
    const address_function_ids = await genericQuery("*", "addresses", "address_identifier", `${req.params.address_id}`);
    const functions_arr = [];
    // @ts-ignore
    for await (const funcid of address_function_ids[0].functions) {
        let res = (await genericQuery("*", "functions", "function_identifier", `${funcid}`));
        functions_arr.push(res[0]);
    }
    let address_flows = [];
    for await (const funcid of functions_arr) {
        // @ts-ignore
        for await (const flowid of funcid.flows) {
            let flow = (await genericQuery("*", "flows", "flow_identifier", `${flowid}`));
            address_flows.push(flow[0]);
        }
    }
    res.status(200).json({ address_flows });
});
app.get("/actions/:action_name", async (req, res) => {
    const actionTable = await genericQuery("*", `${req.params.action_name}`);
    res.status(200).json({ actionTable });
});
app.post("/protocolColor/:protocol_identifier/:colorCode", async (req, res) => {
    await genericPost(`UPDATE "Yieldchain".protocols SET color = ${req.params.colorCode} WHERE protocol_identifier = ${req.params.protocol_identifier}`);
});
app.get("/waitlist", async (req, res) => {
    const waitlist = await genericQuery("*", "waitlist");
    res.status(200).json({ waitlist });
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
// ====================
//        YCAPI
// ====================
app.listen(PORT, () => console.log(`YC API is running on port ${PORT}`));
//# sourceMappingURL=index.js.map