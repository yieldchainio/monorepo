import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
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
    res.status(200).send("ur mum");
});
app.post("/strategy-deployment-data", async (req, res, next) => {
    //
    // Verify the strategy on etherscan
    res.status(200).json({});
});
/****************@App **************************************************/
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
/****************@App **************************************************/
//# sourceMappingURL=index.js.map