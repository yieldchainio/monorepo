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
  CALL_COMMAND_FLAG,
  RAW_REF_VAR_FLAG,
  REF_VAR_FLAG,
  STATICCALL_COMMAND_FLAG,
  VALUE_VAR_FLAG,
} from "@yc/yc-models/src/constants.js";
import { TypeFlags } from "typescript";

const prisma = new PrismaClient();

// Consatnts
const GMX_TOKEN_ADDRESS = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a";
const WETH_TOKEN_ID = "404beaea-3224-413d-bea5-089789d6c78c";
const ESGMX_TOKEN_ID = "2946c03f-fdcf-41b5-bc05-96858c859b7a";
const GNS_TOKEN_ID = "accd4d3c-5268-436b-aa2c-efdb7851e70d";
const DAI_TOKEN_ID = "5e42d4fe-6920-4324-bf0a-438f8e632d02";

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
const GNS_ADDRESS_ID = "1364e77a-555c-42ee-9c89-6b570048e3e3";

// Functions
const getInvestmentAmountFuncID = "b6ce56d0-d032-47ed-a3ff-8dedd81f0c2d";
const selfFuncID = "2e09f2b1-c464-4aa6-9e8e-c2f7c492c4bb";
const balanceOfID = "e265eb5b-e756-437e-86ff-e3ce7dcd0669";
const gmxStakeID = "59276446-87e0-45b6-80bb-f2d045ac9d2e";
const gmxUnstakeID = "484361ca-4612-4e2e-a023-00b00c564e12";

// Arguments
const selfArgumentID = "5a51bd49-bb1a-4b37-b0cb-5e49a1dbbb0c";
const placeholderDivisorArgID = "9abd54f2-fc34-4852-b6b0-4022fd545faf";

// GNS Balance Of Argument
const gnsBalanceOfArgID = uuid();
const gnsBalanceOfArg: argumentsv2 = {
  id: gnsBalanceOfArgID,
  name: "balanceOf",
  custom: false,
  value: balanceOfID,
  solidity_type: "function",
  dev_notes: "Get the GNS Balance of the vault",
  overridden_custom_values: [selfArgumentID],
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  relating_token: null,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
};

await prisma.argumentsv2.create({ data: gnsBalanceOfArg });

// GNS getInvestmentAmount() argument
const gnsAmountArgID = uuid();
const gnsAmountArg: argumentsv2 = {
  id: gnsAmountArgID,
  name: "amount",
  custom: false,
  value: getInvestmentAmountFuncID,
  solidity_type: "function",
  dev_notes: "getInvestmentAmount() wrapper for GNS balanceOf",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  relating_token: GNS_TOKEN_ID,
  overridden_custom_values: [gnsBalanceOfArgID, placeholderDivisorArgID],
};

await prisma.argumentsv2.create({ data: gnsAmountArg });

// The stake function
const gnsStakeFuncID = uuid();
const gnsStakeFunc: functionsv2 = {
  id: gnsStakeFuncID,
  name: "stakeTokens",
  signature: "stakeTokens(uint256)",
  callback: false,
  address_id: GNS_ADDRESS_ID,
  inverse_function_id: null,
  dependancy_function_id: null,
  arguments_ids: [gnsAmountArgID],
  actions_ids: [STAKE_ACTION_ID],
  inflows: [],
  outflows: [GNS_TOKEN_ID],
  typeflag: Typeflags.CALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
};

await prisma.functionsv2.create({ data: gnsStakeFunc });

const gnsHarvestFuncID = uuid();
const gnsHarvestFunc: functionsv2 = {
  id: gnsHarvestFuncID,
  name: "harvest",
  signature: "harvest()",
  arguments_ids: [],
  inflows: [GNS_TOKEN_ID],
  inverse_function_id: null,
  dependancy_function_id: gnsStakeFuncID,
  address_id: GNS_ADDRESS_ID,
  callback: false,
  actions_ids: [HARVEST_ACTION_ID],
  outflows: [],
  typeflag: Typeflags.CALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
};

await prisma.functionsv2.create({ data: gnsHarvestFunc });

const wordExtracterFirstArgID = uuid();
const wordExtracterFirstArg: argumentsv2 = {
  id: wordExtracterFirstArgID,
  name: "arg",
  value: "custom",
  custom: true,
  dev_notes:
    "The original dynamic-length byte inputted into the word extracter function",
  solidity_type: "bytes",
  typeflag: Typeflags.REF_VAR_FLAG,
  ret_typeflag: Typeflags.REF_VAR_FLAG,
  relating_token: null,
  overridden_custom_values: [],
};

const wordExtracterIdxArgID = uuid();
const wordExtracterIdxArg: argumentsv2 = {
  id: wordExtracterIdxArgID,
  name: "idx",
  value: "custom",
  custom: true,
  dev_notes:
    "The index of the word to extract from the original byte inputted into the word extracter function",
  solidity_type: "uint256",
  typeflag: Typeflags.VALUE_VAR_FLAG,
  relating_token: null,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  overridden_custom_values: [],
};

await prisma.argumentsv2.create({ data: wordExtracterFirstArg });
await prisma.argumentsv2.create({ data: wordExtracterIdxArg });

const wordExtracterFuncID = uuid();
const wordExtracterFunc: functionsv2 = {
  id: wordExtracterFuncID,
  name: "extractWordAtIndex",
  signature: "extractWordAtIndex(bytes,uint256)",
  inverse_function_id: null,
  dependancy_function_id: null,
  arguments_ids: [wordExtracterFirstArgID, wordExtracterIdxArgID],
  callback: false,
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  address_id: selfAddressID,
  actions_ids: [],
  outflows: [],
  inflows: [],
};

await prisma.functionsv2.create({ data: wordExtracterFunc });

const gnsStakePositionReaderFuncID = uuid();
const gnsStakePositionReaderFunc: functionsv2 = {
  id: gnsStakePositionReaderFuncID,
  name: "users",
  signature: "users(address)",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  inverse_function_id: null,
  dependancy_function_id: null,
  actions_ids: [],
  outflows: [],
  inflows: [],
  address_id: GNS_ADDRESS_ID,
  arguments_ids: [selfArgumentID],
  callback: false,
};

await prisma.functionsv2.create({ data: gnsStakePositionReaderFunc });

const gnsStakePositionReaderArgID = uuid();
const gnsStakePositionReaderArg: argumentsv2 = {
  id: gnsStakePositionReaderArgID,
  name: "users",
  dev_notes: "Arg used to return the staked GNS of vault",
  value: gnsStakePositionReaderFuncID,
  custom: false,
  solidity_type: "function",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.RAW_REF_VAR_FLAG,
  relating_token: null,
  overridden_custom_values: [],
};

await prisma.argumentsv2.create({ data: gnsStakePositionReaderArg });

const stakedGNSExtracterArgID = uuid();
const stakedGNSExtracterArg: argumentsv2 = {
  id: stakedGNSExtracterArgID,
  name: "amount",
  solidity_type: "function",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  relating_token: null,
  dev_notes:
    "Extracts the staked GNS from the position reader which returns a struct",
  value: wordExtracterFuncID,
  overridden_custom_values: [gnsStakePositionReaderArgID],
  custom: false,
};

await prisma.argumentsv2.create({ data: stakedGNSExtracterArg });

const gnsUnstakeAmountArgID = uuid();
const gnsUnstakeAmountArg: argumentsv2 = {
  id: gnsUnstakeAmountArgID,
  solidity_type: "function",
  custom: false,
  value: getInvestmentAmountFuncID,
  overridden_custom_values: [stakedGNSExtracterArgID, placeholderDivisorArgID],
  name: "amount",
  dev_notes: "get investment amount wrapper for GNS staking reader",
  typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
  relating_token: null,
};

await prisma.argumentsv2.create({ data: gnsUnstakeAmountArg });

const gnsUnstakeFuncID = uuid();

const gnsUnstakeFunc: functionsv2 = {
  id: gnsUnstakeFuncID,
  name: "unstakeTokens",
  signature: "unstakeTokens(uint256)",
  arguments_ids: [gnsUnstakeAmountArgID],
  outflows: [],
  inflows: [GNS_TOKEN_ID, DAI_TOKEN_ID],
  actions_ids: [WITHDRAW_ACTION_ID],
  callback: false,
  inverse_function_id: gnsStakeFuncID,
  dependancy_function_id: gnsStakeFuncID,
  address_id: GNS_ADDRESS_ID,
  typeflag: Typeflags.CALL_COMMAND_FLAG,
  ret_typeflag: Typeflags.VALUE_VAR_FLAG,
};

await prisma.functionsv2.create({ data: gnsUnstakeFunc });
