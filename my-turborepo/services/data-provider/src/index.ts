import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  DBAddress,
  DBArgument,
  DBStrategy,
  DBToken,
  DBProtocol,
  DBFlow,
  DBFunction,
  DBNetwork,
  DBUser,
  DBAction,
  address,
} from "./api-types";
import dotenv from "dotenv";
dotenv.config();

// Instantitate PG Client
const { Client } = pg;

// App to use for reguler API
const app = express();

// Setup parsers & Cors settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Port for reguler app
let PORT: number = 8080;

const client: pg.Client = new Client({
  host: process.env.POSTGRES_HOST,
  user: "OfirYC",
  port: parseInt(process.env.POSTGRES_PORT || "0"),
  password: process.env.POSTGRES_PW || "",
  database: "postgres",
});

client.connect().then(() => console.log("Connected Succesfully"));

const genericQuery = async (
  _what: string,
  _from: string,
  _where?: string,
  _inputs?: string
): Promise<any> => {
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

const genericPost = async (sql: string) => {
  client.query(sql, (err: any, res: any) => {
    if (!err) {
      console.log("Insertion was successfull");
    } else {
      console.log(err.message);
    }
  });
};

const valuesPost = async (sql: string, values: any[]) => {
  client.query(sql, values, (err: any, res: any) => {
    if (!err) {
      console.log("Insertion was successfull");
    } else {
      console.log(err.message);
    }
  });
};

const getTableAvailablePrimaryKey = async (
  tableName: string,
  key_column_name: string
) => {
  let query: any[] = await genericQuery("*", tableName);
  let largestId = query.reduce((x: any, y: any) =>
    x[key_column_name] > y[key_column_name] ? x : y
  );

  return largestId[key_column_name] + 1;
};

/**
 * @dev
 * @notice
 * Queries From The Database Server
 */

app.get("/", async (req: any, res: any) => {
  res.send("Wassup Brah");
});

/**
 * @dev Tokens (e.g. DAI, USDC, etc...)
 */
app.get("/tokens", async (req: any, res: any) => {
  const tokens: DBToken[] = await genericQuery("*", "tokens");
  res.status(200).json({ tokens });
});

/**
 * @dev Networks (e.g. Ethereum, Binance, etc...)
 */
app.get("/networks", async (req: any, res: any) => {
  const networks: DBNetwork[] = await genericQuery("*", "networks");
  res.status(200).json({ networks });
});

/**
 * @dev Strategies made by users.
 */
app.get("/strategies", async (req: any, res: any) => {
  const strategies: DBStrategy[] = await genericQuery("*", "strategies");
  res.status(200).json({ strategies });
});

/**
 * @dev Protocols (e.g. Aave, Yearn, etc...)
 */
app.get("/protocols", async (req: any, res: any) => {
  const protocols: DBProtocol[] = await genericQuery("*", "protocols");
  res.status(200).json({ protocols });
});

/**
 * @dev Addresses (e.g. 0x1234...),
 */
app.get("/addresses", async (req: any, res: any) => {
  const addresses: DBAddress[] = await genericQuery("*", "addresses");
  res.status(200).json({ addresses });
});

/**
 * @dev Token flows - Token ID & Whether it is an inflow or an outflow (boolean)
 */
app.get("/flows", async (req: any, res: any) => {
  const flows: DBFlow[] = await genericQuery("*", "flows");
  res.status(200).json({ flows });
});

/**
 * @dev Parameters/Arguments to use in raw function calls
 */
app.get("/parameters", async (req: any, res: any) => {
  const parameters: DBArgument[] = await genericQuery("*", "parameters");
  res.status(200).json({ parameters });
});

/**
 * @dev Users (e.g. Ofir, Yaron, etc...)
 */
app.get("/users", async (req: any, res: any) => {
  const users: DBUser[] = await genericQuery("*", "users");
  res.status(200).json({ users });
});

/**
 * @dev Functions (raw function classifications)
 */
app.get("/functions", async (req: any, res: any) => {
  const functions: DBFunction[] = await genericQuery("*", "functions");
  res.status(200).json({ functions });
});

/**
 * @dev Actions (e.g Stake, Swap, Harvest, Add Liquidity...),
 */
app.get("/actions", async (req: any, res: any) => {
  const actions: DBAction[] = await genericQuery("*", "actions");
  res.status(200).json({ actions });
});

/**
 * @dev Relations between protocols and addresses. (protocol_identifier => address_identifier)
 */
app.get("/protocols-addresses", async (req: any, res: any) => {
  const protocols_addresses: {
    protocol_identifier: number;
    address_identifier: number;
  }[] = await genericQuery("*", "protocols_addresses");
  res.status(200).json({ protocols_addresses });
});

/**
 * @dev Relations between protocols and networks. (protocol_identifier => chain_id)
 */
app.get("/protocols-networks", async (req: any, res: any) => {
  const protocols_networks: {
    protocol_identifier: number;
    chain_id: number;
  }[] = await genericQuery("*", "protocols_networks");
  res.status(200).json({ protocols_networks });
});

/**
 * @dev Relations between address (address_identifier => address_identifier).
 */
app.get("/address-relations", async (req: any, res: any) => {
  const address_relations: {
    address_identifier: number;
    address_identifier_2: number;
  }[] = await genericQuery("*", "address_relations");
  res.status(200).json({ address_relations });
});

app.get("/address-flows/:address_id", async (req: any, res: any) => {
  const address_function_ids: DBAddress[] = (await genericQuery(
    "*",
    "addresses",
    "address_identifier",
    `${req.params.address_id}`
  )) as DBAddress[];

  const functions_arr: DBFunction[] = [];
  for await (const funcid of address_function_ids[0].functions) {
    let res: DBFunction[] = (await genericQuery(
      "*",
      "functions",
      "function_identifier",
      `${funcid}`
    )) as DBFunction[];
    functions_arr.push(res[0]);
  }

  let address_flows: DBFlow[] = [];
  for await (const funcid of functions_arr) {
    for await (const flowid of funcid.flows) {
      let flow: DBFlow[] = (await genericQuery(
        "*",
        "flows",
        "flow_identifier",
        `${flowid}`
      )) as DBFlow[];
      address_flows.push(flow[0]);
    }
  }

  res.status(200).json({ address_flows });
});

app.get("/actions/:action_name", async (req: any, res: any) => {
  const actionTable: { function_identifier: number }[] = await genericQuery(
    "*",
    `${req.params.action_name}`
  );
  res.status(200).json({ actionTable });
});

app.post(
  "/protocolColor/:protocol_identifier/:colorCode",
  async (req: any, res: any) => {
    await genericPost(
      `UPDATE "Yieldchain".protocols SET color = ${req.params.colorCode} WHERE protocol_identifier = ${req.params.protocol_identifier}`
    );
  }
);

app.post("/signup", async (req: any, res: any) => {
  let data: {
    address: address;
    email: string;
  } = req.body;
  await genericPost(
    `INSERT INTO "Yieldchain".waitlist (address, email) VALUES ('${data.address}', '${data.email}')`
  );
});

app.get("/waitlist", async (req: any, res: any) => {
  const waitlist: any = await genericQuery("*", "waitlist");
  res.status(200).json({ waitlist });
});

// ====================
//        YCAPI
// ====================
app.listen(PORT, () => console.log(`YC API is running on port ${PORT}`));
