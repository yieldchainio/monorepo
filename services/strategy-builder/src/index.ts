import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { headGeneration } from "./generation-scripts/head-generation.js";
import { getStrategyTxid, verifyContract } from "./deployment.js";
import ganache from "ganache";
import { IStrategy } from "./generation-types";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pg;
const app = express();
app.use(cors());
app.options("*", cors()); // enable pre-flight

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let PORT = 8080;

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: "OfirYC",
  port: parseInt(process.env.POSTGRES_PORT || "0"),
  password: process.env.POSTGRES_PW,
  database: "postgres",
});

client.connect().then(() => console.log("Connected Succesfully"));

const genericQuery = async (
  _what: any,
  _from: any,
  _where?: any,
  _inputs?: any
) => {
  return new Promise(function (res, rej) {
    var sql;
    if (_where !== undefined || null) {
      sql = `SELECT ${_what} FROM "Yieldchain".${_from} WHERE ${_where} = ${_inputs}`;
    } else {
      sql = `SELECT ${_what} FROM "Yieldchain".${_from}`;
    }
    client.query(sql, (err: any, rows: any) => {
      if (!err) {
        res(rows.rows);
      } else {
        rej(err.message);
      }
    });
  });
};

const genericPost = async (sql: any) => {
  client.query(sql, (err: any, res: any) => {
    if (!err) {
      console.log("Insertion was successfull");
    } else {
      console.log(err.message);
    }
  });
};

const valuesPost = async (sql: any, values: any) => {
  client.query(sql, values, (err: any, res: any) => {
    if (!err) {
      console.log("Insertion was successfull");
    } else {
      console.log(err.message);
    }
  });
};

/**
 * @dev
 * @notice
 * Queries From The Database Server
 */

app.post("/create-strategy", async (req: any, res: any, next: any) => {
  let data = req.body;
  let file_name = await headGeneration(data.strategyObject);
  let txidData = await getStrategyTxid(file_name, data.strategyObject.network);
  console.log("Got TXID DATA!!!", txidData);
  res.status(200).send({ txidData });
});

app.post("/add-strategy", async (req: any, res: any) => {
  let data = req.body;
  let strategyObject: IStrategy = data.strategyObject;

  await valuesPost(
    `INSERT INTO "Yieldchain".strategies (address, name, upkeep_id, apy, tvl, main_protocol_identifier, creator_user_identifier, chain_id, main_token_identifier, final_token_identifier, is_verified, is_trending, execution_interval, strategy_object) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      strategyObject.address,
      strategyObject.name,
      strategyObject.upkeep_id,
      strategyObject.apy,
      strategyObject.tvl,
      strategyObject.main_protocol_identifier,
      strategyObject.creator_user_identifier,
      strategyObject.chain_id,
      strategyObject.main_token_identifier,
      strategyObject.final_token_identifier,
      strategyObject.is_verified,
      strategyObject.is_trending,
      strategyObject.execution_interval,
      strategyObject.strategy_object,
    ]
  );

  // Verify the strategy on etherscan
  verifyContract(strategyObject.address);
  res.status(200).json({ strategyObject });
});

app.post("/fork", async (req: any, res: any) => {
  let data: any = req.body;
  let gOptions: any = data.ganacheOptions;
  let tPort: number = data.port;
  let ganacheServer: any = ganache.server(gOptions);
  try {
    ganacheServer.listen(tPort, async (err: any) => {
      if (err) throw "Error starting forked chain" + err;
      console.log("Forked chain started on port " + tPort);
      res.status(200).send({ success: true });
    });
  } catch (e) {
    throw new Error("Error starting forked chain on index endpoint " + e);
  }
});

app.get("/", async (req: any, res: any) => {
  res.status(200).send("Hello World!");
});

/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
