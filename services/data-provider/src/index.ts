import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  DBContract,
  DBArgument,
  JSONStrategy,
  DBToken,
  DBProtocol,
  DBFlow,
  DBFunction,
  DBNetwork,
  DBUser,
  DBAction,
  address,
  SignupArguments,
  UserUpdateArguments,
  JSONTier,
} from "@yc/yc-models";
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
let PORT: number = 8080;

/**
 * @dev
 * @notice
 * Queries From The Database Server
 */

app.get("/", async (req: any, res: any) => {
  res.status(200).send("Wassup Brah");
});

// ======================
//      V2 ENDPOINTS
// ======================

app.get("/v2", async (req: any, res: any) => {
  res.status(200).send("Wassup Brah");
});

/**
 * @dev Tokens (e.g. DAI, USDC, etc...)
 */
app.get("/v2/tokens", async (req: any, res: any) => {
  const tokens: DBToken[] = await prisma.tokensv2.findMany();
  res.status(200).json({ tokens });
});

/**
 * @dev Networks (e.g. Ethereum, Binance, etc...)
 */
app.get("/v2/networks", async (req: any, res: any) => {
  const networks: DBNetwork[] = await prisma.networksv2.findMany();
  res.status(200).json({ networks });
});

/**
 * @dev Strategies made by users.
 */
app.get("/v2/strategies", async (req: any, res: any) => {
  // @ts-ignore
  const strategies: JSONStrategy[] = await prisma.strategiesv2.findMany(); // TODO: Change strategiesv2 token id to string, migrate
  res.status(200).json({ strategies });
});

/**
 * @dev Protocols (e.g. Aave, Yearn, etc...)
 */
app.get("/v2/protocols", async (req: any, res: any) => {
  const protocols: DBProtocol[] = await prisma.protocolsv2.findMany();
  res.status(200).json({ protocols });
});

/**
 * @dev Addresses (e.g. 0x1234...),
 */
app.get("/v2/addresses", async (req: any, res: any) => {
  const addresses: DBContract[] = await prisma.addressesv2.findMany();
  res.status(200).json({ addresses });
});

/**
 * @dev Parameters/Arguments to use in raw function calls
 */
app.get("/v2/parameters", async (req: any, res: any) => {
  const parameters: DBArgument[] = await prisma.argumentsv2.findMany();
  res.status(200).json({ parameters });
});

/**
 * @dev Users (e.g. Ofir, Eden, etc...)
 */
app.get("/v2/users", async (req: any, res: any) => {
  const users: DBUser[] = await prisma.usersv2.findMany();
  res.status(200).json({ users });
});

/**
 * @dev Functions (raw function classifications)
 */
app.get("/v2/functions", async (req: any, res: any) => {
  const functions: DBFunction[] = await prisma.functionsv2.findMany();
  res.status(200).json({ functions });
});

/**
 * @dev statistics about strategies (apy, gas fees in timestamps. To generate charts and etc)
 */
app.get("/v2/statistics", async (req: any, res: any) => {
  const statistics = await prisma.statistics.findMany();
  res.status(200).json({ statistics });
});

/**
 * @dev Actions (e.g Stake, Swap, Harvest, Add Liquidity...),
 */
app.get("/v2/actions", async (req: any, res: any) => {
  const actions: DBAction[] = await prisma.actionsv2.findMany();
  res.status(200).json({ actions });
});

app.get("/v2/tiers", async (req: any, res: any) => {
  const tiers: JSONTier[] = await prisma.tier.findMany();
  res.status(200).json({
    tiers: tiers.map((tier) => ({
      ...tier,
      monthly_price: tier.monthly_price.toString(),
      lifetime_price: tier.lifetime_price.toString(),
    })),
  });
});

app.post(
  "/signup",
  async (
    req: {
      body: Omit<SignupArguments, "context">;
    },
    res: any
  ) => {
    const data: Omit<SignupArguments, "context"> = req.body;
    if (
      await prisma.usersv2.findFirst({
        where: {
          address: {
            equals: data.address,
            mode: "insensitive",
          },
        },
      })
    )
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

    if (result) res.status(200).json({ user: data });
    else res.status(400);
  }
);

app.post(
  "/update-user",
  async (
    req: {
      body: {
        id: string;
        username?: string;
        description?: string;
        twitter?: string;
        telegram?: string;
        discord?: string;
        profile_picture?: string;
      };
    },
    res: any
  ) => {
    const data: {
      id: string;
      username?: string;
      description?: string;
      twitter?: string;
      telegram?: string;
      discord?: string;
      profile_picture?: string;
    } = req.body;
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

    if (result) res.status(200).json({ user: data });
    else res.status(400);
  }
);

// ====================
//        YCAPI
// ====================
app.listen(PORT, () => console.log(`YC API is running on port ${PORT}`));
