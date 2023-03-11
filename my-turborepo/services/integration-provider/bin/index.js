import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
// Instantitate PG Client
const { Client } = pg;
// App to use for reguler API
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const PORT = 8080;
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
const getTableAvailablePrimaryKey = async (tableName, key_column_name) => {
    let query = await genericQuery("*", tableName);
    let largestId = query.reduce((x, y) => x[key_column_name] > y[key_column_name] ? x : y);
    return largestId[key_column_name] + 1;
};
/**
 * @notice
 * Endpoints for integrations
 */
app.get("/", (req, res) => {
    res.status(200).send("OK");
});
app.post("/add-token", async (req, res) => {
    console.log("Got request for adding token: ", req.body);
    let sql = `INSERT INTO "Yieldchain".tokens (token_identifier, name, address, symbol, decimals, coinKey, priceUsd, chain_id, markets) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    let tTokenId = await getTableAvailablePrimaryKey("tokens", "token_identifier");
    console.log("Token ID: ", tTokenId);
    let values = [
        tTokenId,
        req.body.name,
        req.body.address,
        req.body.symbol,
        req.body.decimals,
        req.body.coinKey,
        req.body.priceUsd,
        req.body.chain_id,
        req.body.markets,
    ];
    try {
        await valuesPost(sql, values);
        res.status(200).send({ token_identifier: tTokenId });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-function-to-action", async (req, res) => {
    console.log("Inside Add Function To action, req: ", req.body);
    let actionDetails = await genericQuery("*", "actions", "action_identifier", req.body.action_identifier);
    console.log("Action Details: ", actionDetails);
    // ACtiondetails.name in lowercase with all spaces removed
    let reqTableName = actionDetails[0].name.toLowerCase().replace(/\s/g, "");
    let sql = `INSERT INTO "Yieldchain".${reqTableName} (function_identifier) VALUES ($1)`;
    let values = [req.body.function_identifier];
    try {
        await valuesPost(sql, values);
        res.status(200).send(true);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-protocol-network", async (req, res) => {
    let sql = `INSERT INTO "Yieldchain"."protocols_networks" (protocol_identifier, chain_id) VALUES ($1, $2)`;
    let values = [req.body.protocol_identifier, req.body.chain_id];
    try {
        await valuesPost(sql, values);
        res.status(200).send(true);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-protocol-address", async (req, res) => {
    let sql = `INSERT INTO "Yieldchain"."protocols_addresses" (protocol_identifier, address_identifier) VALUES ($1, $2)`;
    let values = [req.body.protocol_identifier, req.body.address_identifier];
    try {
        await valuesPost(sql, values);
        res.status(200).send(true);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-address", async (req, res) => {
    let tAddressId = await getTableAvailablePrimaryKey("addresses", "address_identifier");
    let sql = `INSERT INTO "Yieldchain".addresses (address_identifier, contract_address, abi, chain_id, functions) VALUES ($1, $2, $3, $4, $5) RETURNING address_identifier`;
    let values = [
        tAddressId,
        req.body.contract_address,
        req.body.abi,
        req.body.chain_id,
        req.body.functions,
    ];
    try {
        await valuesPost(sql, values);
        res.status(200).send({ address_identifier: tAddressId });
    }
    catch (e) {
        res.status(400).send(null);
    }
});
app.post("/add-parameter", async (req, res) => {
    let tParamId = await getTableAvailablePrimaryKey("parameters", "parameter_identifier");
    let sql = `INSERT INTO "Yieldchain".parameters (parameter_identifier, index, solidity_type, value, name) VALUES ($1, $2, $3, $4, $5) RETURNING parameter_identifier`;
    let values = [
        tParamId,
        req.body.index,
        req.body.solidity_type,
        req.body.value,
        req.body.name,
    ];
    try {
        await valuesPost(sql, values);
        res.status(200).send({ parameter_identifier: tParamId });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-flow", async (req, res) => {
    let tFlowId = await getTableAvailablePrimaryKey("flows", "flow_identifier");
    let sql = `INSERT INTO "Yieldchain".flows (flow_identifier, token_identifier, outflow0_or_inflow1) VALUES ($1, $2, $3) RETURNING flow_identifier`;
    let values = [
        tFlowId,
        req.body.token_identifier,
        req.body.outflow0_or_inflow1,
    ];
    try {
        await valuesPost(sql, values);
        res.status(200).send({ flow_identifier: tFlowId });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/add-function", async (req, res) => {
    let tFuncId = await getTableAvailablePrimaryKey("functions", "function_identifier");
    let sql = `INSERT INTO "Yieldchain".functions (function_identifier, function_name, number_of_parameters, flows, arguments, is_callback, counter_function_identifier, unlocked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING function_identifier`; // prettier-ignore
    let values = [
        tFuncId,
        req.body.function_name,
        req.body.number_of_parameters,
        req.body.flows,
        req.body.arguments,
        req.body.is_callback,
        req.body.counter_function_identifier,
        req.body.unlocked_by,
    ];
    try {
        await valuesPost(sql, values);
        res.status(200).send({ function_identifier: tFuncId });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
app.post("/update-function/:function_identifier", async (req, res) => {
    let hasCounterFuncId = req.body.counter_function_identifier || null;
    let hasUnlockedBy = req.body.unlocked_by || null;
    if (hasCounterFuncId !== null) {
        let sql = `UPDATE "Yieldchain".functions SET counter_function_identifier = $1 WHERE function_identifier = $2`;
        let values = [
            req.body.counter_function_identifier,
            req.params.function_identifier,
        ];
        await valuesPost(sql, values);
    }
    if (hasUnlockedBy !== null) {
        let sql = `UPDATE "Yieldchain".functions SET unlocked_by = $1 WHERE function_identifier = $2`;
        let values = [req.body.unlocked_by, req.params.function_identifier];
        await valuesPost(sql, values);
    }
    res.status(200).send(true);
});
// ====================
//        LISTEN
// ====================
app.listen(PORT, () => console.log(`YC API is running on port ${PORT}`));
//# sourceMappingURL=index.js.map