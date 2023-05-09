import {
  PrismaClient,
  Typeflags,
  addressesv2,
  argumentsv2,
  functionsv2,
} from "@prisma/client";
import { rewardsABI, stakingABI } from "./gmx-abi.js";
import { v4 as uuid, validate } from "uuid";
import { ethers } from "ethers";
import {
  STATICCALL_COMMAND_FLAG,
  VALUE_VAR_FLAG,
} from "@yc/yc-models/src/constants.js";

const prisma = new PrismaClient();

// Consatnts
const GMX_TOKEN_ADDRESS = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a";
const GMX_TOKEN_ID = "7b2b1d26-61cc-4923-891b-e0ce3fce21a9";

// Actions
const STAKE_ACTION_ID = "62bb7a58-6e0c-4b11-90ce-d416bd3dd10f";
const WITHDRAW_ACTION_ID = "964421b0-23a4-45c0-b099-2a3121251542";
const HARVEST_ACTION_ID = "dc5c5c0a-e594-4974-8a46-829a76a95fa7";

// Protocols
const gmxProtocolId = "11e53788-0a3b-4ae0-add1-3ddf52117e08";

// Addresses
const stakingAddressID = "c5cc8316-5db2-4e25-8785-d1ccd7db66c9";
const rewardsAddressID = "e56a9440-9ce7-4fc7-b5b3-3d75fa07ddb4";
const selfAddressID: string = "0";

// Functions
const getInvestmentAmountFuncID = "b6ce56d0-d032-47ed-a3ff-8dedd81f0c2d";
const selfFuncID = "2e09f2b1-c464-4aa6-9e8e-c2f7c492c4bb";
const balanceOfID = "e265eb5b-e756-437e-86ff-e3ce7dcd0669";
const placeholderDivisorArgID = "9abd54f2-fc34-4852-b6b0-4022fd545faf";

const stakeFuncID = uuid();

const stakeFunc: functionsv2 = {
  id: stakeFuncID,
  name: "stakeGmx",
  signature: "stakeGmx(uint256)",
  arguments_ids: [],
  outflows: [GMX_TOKEN_ID],
  inflows: [],
  inverse_function_id: null,
  dependancy_function_id: null,
  typeflag: Typeflags.CALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  address_id: stakingAddressID,
  callback: false,
  actions_ids: [STAKE_ACTION_ID],
};

await prisma.functionsv2.create({ data: stakeFunc });

const gmxBalanceOfID = uuid();

const gmxAddressArgID = uuid();
const gmxAddressAsArg: argumentsv2 = {
  id: gmxAddressArgID,
  value: GMX_TOKEN_ADDRESS,
  typeflag: Typeflags.VALUE_VAR_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  custom: false,
  dev_notes: null,
  solidity_type: "address",
  name: "account",
};
const gmxBalanceOfFunction: functionsv2 = {
  id: gmxBalanceOfID,
  name: "balanceOf",
  signature: "balanceOf(address)",
  callback: false,
  arguments_ids,
};

const gmxBalanceOfAsArg: argumentsv2 = {
  id: gmxBalanceOfID,
  name: "amount",
  custom: false,
  solidity_type: "function",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  dev_notes:
    "This is the function call which returns the balance of GMX for a given address",
  value: balanceOfID,
  preconfigured_custom_values: [GMX_TOKEN_ADDRESS],
  function_id: stakeFuncID,
  relating_token: GMX_TOKEN_ADDRESS,
};

await prisma.argumentsv2.create({ data: gmxBalanceOfAsArg });

const gmxStakeAmountArgID = uuid();

const gmxStakeAmountArg: argumentsv2 = {
  id: gmxStakeAmountArgID,
  name: "amount",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  value: getInvestmentAmountFuncID,
  solidity_type: "function",
  preconfigured_custom_values: [gmxBalanceOfID],
};
// const gmxBalanceOfGetter
// const unstakeFuncID = uuid();
// const harvestFuncID = uuid();

// const stakeFunc: functionsv2 = {
//   name: "stakeGmx",
// };
