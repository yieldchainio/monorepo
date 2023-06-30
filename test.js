import axios from "axios";

const res = await axios.get("http://localhost:8080/v2/strategies");

const data = res.data.strategies;

const createdAt = data[0].createdAt;

console.log(typeof new Date(createdAt));
