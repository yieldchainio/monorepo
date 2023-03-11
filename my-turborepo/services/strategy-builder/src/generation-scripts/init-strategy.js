"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStrategy = void 0;
// import hardhat from "hardhat";
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const url_1 = require("url");
const __dirname = (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));
const web3_1 = __importDefault(require("web3"));
const axios_1 = __importDefault(require("axios"));
const utils_js_1 = require("./utils.js");
const initStrategy = async (_strategy_obj) => {
    /**
     * @notice loading boilerplate variables from input object
     */
    let name = _strategy_obj.strategy_name;
    let exec_interval = _strategy_obj.execution_interval;
    let init_strategy_obj = _strategy_obj.strategy_initiation;
    // TODO: Need to Configure The Code Under me to take & generate multi-basepools initiation, with % for each pool &
    // TODO: Auto Swap/Zap to each required outflow token, and create temp balance variables within the deposit function
    // TODO: AS Needed
    let vault_deposit_token_identifier = _strategy_obj.vault_deposit_token_identifier;
    let vault_deposit_token = await (0, utils_js_1.getTokenDetails)(vault_deposit_token_identifier);
    let base_steps = init_strategy_obj.base_steps;
    let base_steps_functions_details = await base_steps.map(async (base_step_item) => (base_step_item = await (0, utils_js_1.getFunctionDetails)(base_step_item.function_identifier)));
    let steps_array = _strategy_obj.steps_array;
    /**
     * @notice Loading Initial Context Needed From The Database, provided by "_dataBaseContext" @param
     */
    let file_name = `${name.replace(/\s/g, "")}.sol`;
    let factory_file_name = `${name.replace(/\s/g, "")}Factory.sol`;
    // Shorthand Functions For fs.write/read/appendFileSync()
    const writeToFile = async (_fileName, _content) => {
        await fs_1.default.writeFileSync(_fileName, _content);
    };
    const appendToFile = async (_fileName, _content) => {
        await fs_1.default.appendFileSync(_fileName, _content);
    };
    const appendNewLineShortcut = async (_content) => {
        await appendToFile(file_name, `\n${_content}`);
    };
    const appendNewLineInterContract = async (_content) => {
        await appendToFile(file_name, `\n    ${_content}`);
    };
    const appendNewLineInterFunction = async (_content) => {
        await appendToFile(file_name, `\n        ${_content}`);
    };
    const appendNewLineInterFunction2x = async (_content) => {
        await appendToFile(file_name, `\n            ${_content}`);
    };
    const appendNewLineInterFunction3x = async (_content) => {
        await appendToFile(file_name, `\n                ${_content}`);
    };
    const appendNewLineShortcutFactory = async (_content) => {
        await appendToFile(factory_file_name, `\n${_content}`);
    };
    const appendNewLineInterContractFactory = async (_content) => {
        await appendToFile(factory_file_name, `\n    ${_content}`);
    };
    const appendNewLineInterFunctionFactory = async (_content) => {
        await appendToFile(factory_file_name, `\n        ${_content}`);
    };
    const appendNewLineInterFunction2xFactory = async (_content) => {
        await appendToFile(factory_file_name, `\n            ${_content}`);
    };
    const appendNewLineInterFunction3xFactory = async (_content) => {
        await appendToFile(factory_file_name, `\n                ${_content}`);
    };
    const spacing = async () => {
        await appendToFile(file_name, `\n\n`);
    };
    const appendSameLine = async (_content) => {
        await appendToFile(file_name, _content);
    };
    const initiateSolFile = async () => {
        // Initiation
        await writeToFile(file_name, `// SPDX-License-Identifier: UNLICENSED`);
        await appendNewLineShortcut(`pragma solidity ^0.8.9;`);
        await appendNewLineShortcut(`pragma experimental ABIEncoderV2;`);
        // Imports
        await appendNewLineShortcut(`import "@openzeppelin/contracts/token/ERC20/IERC20.sol";`);
        //TODO: Automation
        // await appendNewLineShortcut(
        //   `import "../chainlink/contracts/src/v0.8/AutomationCompatible.sol";`
        // );
        // Initiate Contract
        await appendNewLineShortcut(`contract ${name.replace(/\s/g, "")}  {`);
    };
    const generateAdditionalBoilerplate = async () => {
        // Variables
        await appendNewLineInterContract(`IERC20 public vault_deposit_token = IERC20(${web3_1.default.utils.toChecksumAddress(vault_deposit_token.address)});`);
        await appendNewLineInterContract(`// The current chain's ID`);
        await appendNewLineInterContract(`uint currentChainId = 56;`);
        await appendNewLineInterContract(`// Return Data From The Latest Low-Level Call`);
        await appendNewLineInterContract(`bytes public latestContractData;`);
        await appendNewLineInterContract(`// The Backend Executor's Address`);
        await appendNewLineInterContract(`address executorAddress = 0xc6EAE321040E68C4152A19Abd584c376dc4d2159;`);
        await appendNewLineInterContract(`// The Factory's Address`);
        await appendNewLineInterContract(`address factoryAddress = 0xc6EAE321040E68C4152A19Abd584c376dc4d2159;`);
        await appendNewLineInterContract(`// The Title Of the Strategy (Set By Creator)`);
        await appendNewLineInterContract(`string public strategyTitle = "${name}";`);
        await appendNewLineInterContract(`// The Current Active Step`);
        await appendNewLineInterContract(`StepDetails activeStep;`);
        await appendNewLineInterContract(`// The Current Active Divisor For the Steps`);
        await appendNewLineInterFunction(`uint public activeDivisor = 1;`);
        await appendNewLineInterContract(`// The Current Active Step's Custom Arguments (Set By Creator)`);
        await appendNewLineInterContract(`bytes[] current_custom_arguments;`);
        // Vault related Stuff
        await appendNewLineInterContract(`// Total vault shares (1:1 w deposit tokens that were deposited)`);
        await appendNewLineInterContract(`uint public totalVaultShares;`);
        await appendNewLineInterContract(`// Mapping of user addresses to shares`);
        await appendNewLineInterContract(`mapping(address => uint) public userShares;`);
        // @Keepers related stuff
        // await appendNewLineInterContract(
        //   `address public immutable automatorContract;`
        // );
        await appendNewLineInterContract(`uint256 public upKeepID;`);
        await appendNewLineInterContract(`uint256 public lastTimestamp;`);
        await appendNewLineInterContract(`uint256 public interval = ${exec_interval};`);
        // Modifiers
        await appendNewLineInterContract(`// Allows Only The Address Of Yieldchain's Backend Executor To Call The Function`);
        await appendNewLineInterContract(`modifier onlyExecutor() {`);
        await appendNewLineInterFunction(`require(msg.sender == executorAddress || msg.sender == address(this));`);
        await appendNewLineInterFunction(`_;`);
        await appendNewLineInterContract(`}`);
        await appendNewLineInterContract("// Allows only the chainlink automator contract to call the function");
        // await appendNewLineInterContract(`modifier isAutomator() {`);
        // await appendNewLineInterFunction(
        //   `require(msg.sender == automatorContract);`
        // );
        // await appendNewLineInterFunction(`_;`);
        // await appendNewLineInterContract(`}`);
        // Automator Utility (Sets the upkeep ID for the contract (Called by automation manager only))
        // await appendNewLineInterContract(
        //   `function setUpkeepId(uint256 _upkeepId) public isAutomator {`
        // );
        // await appendNewLineInterFunction(`upKeepID = _upkeepId;`);
        // await appendNewLineInterContract(`}`);
        // // Allows only for a single initiation
        // await appendNewLineInterContract(`bool internal initiated = false;`);
        // // Automator Utility - Initiate The Upkeep (Called in initiallize function)
        // await appendNewLineInterContract(`function InitiateUpkeep() public {`);
        // await appendNewLineInterFunction(
        //   `require(!initiated, "Contract already initiated");`
        // );
        // await appendNewLineInterFunction(
        //   `(bool success, bytes memory result) = automatorContract.call(`
        // );
        // await appendNewLineInterFunction2x(`abi.encodeWithSignature(`);
        // await appendNewLineInterFunction3x(
        //   `"registerAndPredictId(string,uint96)",`
        // );
        // await appendNewLineInterFunction3x(`"${name}",`);
        // await appendNewLineInterFunction3x(`50000000000000000000`);
        // await appendNewLineInterFunction2x(`)`);
        // await appendNewLineInterFunction(`);`);
        // await appendNewLineInterContract(`}`);
        // Automator Utility (Fund Gas Baance)
        // await appendNewLineInterContractFactory(
        //   `function fundGasBalance(uint256 _amountLinkTokens) public {`
        // );
        // await appendNewLineInterFunctionFactory(`automatorContract.call(`);
        // await appendNewLineInterFunction2xFactory(`abi.encodeWithSignature(`);
        // await appendNewLineInterFunction3xFactory(
        //   `"fundStrategyGasBalance(uint256,uint96)",`
        // );
        // await appendNewLineInterFunction3xFactory(`upKeepID,`);
        // await appendNewLineInterFunction3xFactory(`_amountLinkTokens`);
        // await appendNewLineInterFunction2xFactory(`)`);
        // await appendNewLineInterFunctionFactory(`);`);
        // await appendNewLineInterContractFactory(`}`);
        // // ChainLink Interface Utility (Check Upkeep (Check Condition))
        // await appendNewLineInterContractFactory(`function checkUpkeep(`);
        // await appendNewLineInterFunctionFactory(`bytes calldata /* checkData */)`);
        // await appendNewLineInterFunctionFactory(`external`);
        // await appendNewLineInterFunctionFactory(`view`);
        // await appendNewLineInterFunctionFactory(`override`);
        // await appendNewLineInterFunctionFactory(`returns (`);
        // await appendNewLineInterFunction2xFactory(`bool upkeepNeeded,`);
        // await appendNewLineInterFunction2xFactory(`bytes memory /* performData */`);
        // await appendNewLineInterFunctionFactory(`)`);
        // await appendNewLineInterContractFactory(`{`);
        // await appendNewLineInterFunctionFactory(
        //   `upkeepNeeded = (block.timestamp - lastTimestamp) > interval;`
        // );
        // await appendNewLineInterContractFactory(`}`);
        // ChainLink Interface Utility (Perform Upkeep (run strategy))
        // await appendNewLineInterContractFactory(`function performUpkeep(`);
        // await appendNewLineInterFunctionFactory(`bytes calldata /* performData */`);
        // await appendNewLineInterContractFactory(`) external override {`);
        // await appendNewLineInterFunctionFactory(
        //   `if ((block.timestamp - lastTimestamp) > interval) {`
        // );
        // await appendNewLineInterFunction2xFactory(
        //   `lastTimestamp = block.timestamp;`
        // );
        // await appendNewLineInterFunction2xFactory(`strategyRunNeeded();`);
        // await appendNewLineInterFunctionFactory(`}`);
        // await appendNewLineInterContractFactory(`}`);
        // // Chainlink Automation Calls This function (triggers offchain strategy trigger)
        // // Instead of having Chainlink trigger the run strategy and have them pay for the gas (With their fees ontop of it),
        // // We have them trigger this function, which then emits an event that our backend executor listens for.
        // await appendNewLineInterContract(
        //   `function strategyRunNeeded() public isAutomator {`
        // );
        // await appendNewLineInterFunction(
        //   `bytes[] memory placeholder = new bytes[](0);`
        // );
        // await appendNewLineInterFunction(
        //   `emit CallbackEvent("runStrategy", "strategyRunNeeded", placeholder);`
        // );
        // await appendNewLineInterContract(`}`);
        // Structs
        await appendNewLineInterContract(`// Struct Object Format For Steps, Used To Store The Steps Details,
      // The Divisor Is Used To Divide The Token Balances At Each Step,
      // The Custom Arguments Are Used To Store Any Custom Arguments That The Creator May Want To Pass To The Step`);
        await appendNewLineInterContract(`struct StepDetails {`);
        await appendNewLineInterFunction(`uint div;`);
        await appendNewLineInterFunction(`bytes[] custom_arguments;`);
        await appendNewLineInterContract(`}`);
        // Constructor
        await appendNewLineInterContract(`// Initiallizes The Contract, Sets Owner, Approves Tokens`);
        await appendNewLineInterContract(`constructor() {`);
        for await (const step of steps_array) {
            let div = step.divisor;
            await appendNewLineInterFunction(`steps[${step.step_identifier}] = step_${step.step_identifier};`);
        }
        await appendNewLineInterContract(`approveAllTokens();`);
        await appendNewLineInterContract(`}`);
        // Adds Spacing For Cleanness
        ///////////////
        spacing(); ///
        /////////////
        await appendNewLineInterContract(`// Event That Gets Called On Each Callback Function That Requires Offchain Processing`);
        await appendNewLineInterContract(`event CallbackEvent(string functionToEval, string operationOrigin, bytes[] callback_arguments);`);
        await appendNewLineInterContract(`// Deposit & Withdraw Events`);
        await appendNewLineInterContract(`event Deposit(address indexed user, uint256 indexed amount);`);
        await appendNewLineInterContract(`event Withdraw(address indexed user, uint256 indexed amount);`);
        await appendNewLineInterContract(`// Internal Approval`);
        await appendNewLineInterContract(`function internalApprove(address _token, address _spender, uint256 _amount) public {
        IERC20(_token).approve(_spender, _amount);
      }`);
        // Boilerplate Functions
        // Update Active Step Details Function
        await appendNewLineInterContract(`// Update Current Active Step's Details`);
        await appendNewLineInterContract(`function updateActiveStep(StepDetails memory _argStep) internal {`);
        await appendNewLineInterFunction(`activeStep = _argStep;`);
        await appendNewLineInterFunction(`activeDivisor = _argStep.div;`);
        await appendNewLineInterFunction(`current_custom_arguments = _argStep.custom_arguments;`);
        await appendNewLineInterContract(`}`);
        // Getter for step details
        await appendNewLineInterContract(`// Get a Step's details`);
        await appendNewLineInterContract(`function getStepDetails(uint _step) public view returns (StepDetails memory) {`);
        await appendNewLineInterFunction(`return steps[_step];`);
        await appendNewLineInterContract(`}`);
        // Getter for token
        // Deposit Function For The Strategy Contract
        await appendNewLineInterContract(`// Initial Deposit Function, Called By User/EOA, Triggers Callback Event W Amount Params Inputted`);
        await appendNewLineInterContract(`function deposit(uint256 _amount) public {`);
        await appendNewLineInterFunction(`require(_amount > 0, "Deposit must be above 0");`);
        await appendNewLineInterFunction(`updateBalances();`);
        await appendNewLineInterFunction(`vault_deposit_token.transferFrom(msg.sender, address(this), _amount);`);
        await appendNewLineInterFunction(`totalVaultShares += _amount;`);
        await appendNewLineInterFunction(`userShares[msg.sender] += _amount;`);
        // Initial Deposit (Called By User/EOA)
        let wasPostDepositinit = false;
        // Array Of Outflows, Minus The Deposit Token
        let outflows_arr_no_initial = [];
        const generateInitialDepositFunction = async (_base_step, _wasInitialGenerated) => {
            // Initiation For Function-Scoped Variables
            let base_step = _base_step;
            let flow_ids_arr = (await (0, utils_js_1.getFunctionDetails)(base_step.function_identifiers[0])).flows;
            let outflows_arr = [];
            let step_func_details = await (0, utils_js_1.getFunctionDetails)(base_step.function_identifiers[0]);
            let step_func_name = step_func_details.function_name;
            let step_func_identifier = step_func_details.function_identifier;
            let step_func_params_arr = [];
            let params_values_arr = [];
            let balances_params_arr = [];
            let step_address = base_step.address_identifiers[0];
            let is_current_last = base_steps.findIndex((t) => t.step_identifier == base_step.step_identifier) ==
                base_steps.length - 1
                ? true
                : false;
            // Get Each Arg For Step's Function, Push To Array
            for await (const arg of step_func_details.arguments) {
                let argdetails = await (0, utils_js_1.getParameterDetails)(arg);
                await step_func_params_arr.push(argdetails);
                await params_values_arr.push(argdetails.value);
                if (argdetails.value.split(" / activeDivisor")[0].split("_")[1] ==
                    "BALANCE") {
                    await balances_params_arr.push(argdetails);
                }
                else {
                }
            }
            // Get Each Flow's Details, Push To Outflows Array If It Is Found To Be An Outflow
            for await (const flow_id of flow_ids_arr) {
                await (0, utils_js_1.getFlowDetails)(flow_id).then((flow_details_obj) => {
                    if (flow_details_obj.outflow0_or_inflow1 == 0) {
                        outflows_arr.push(flow_details_obj);
                    }
                });
            }
            // Same Outflows Array As Above, With The Deposit Token Of The Vault Emitted Out Of It.
            // This Is Done In Order To Not Initiate A Swap To & From The Exact Same Token, Which Not Only May Break Things,
            // But Is Also Just Extremely Dumb & Costs Extra Gas / Fees.
            for await (const outflowObj of outflows_arr) {
                (await (0, utils_js_1.getTokenDetails)(outflowObj.token_identifier)).address.toLowerCase() !== vault_deposit_token.address.toLowerCase()
                    ? outflows_arr_no_initial.push(outflowObj)
                    : undefined;
            }
            // Checks If Initial Function Was Already Executed & Executes It If It Wasnt Already
            if (!_wasInitialGenerated) {
                _wasInitialGenerated = true;
                if (is_current_last) {
                    // Array Of Tokens To Swap To
                    await appendNewLineInterFunction(`address[] memory to_tokens_arr = new address[](${outflows_arr_no_initial.length});`);
                    // Array Of Divisors To Tokens It Will Swap To
                    await appendNewLineInterFunction(`uint[] memory to_tokens_divs_arr = new uint[](${outflows_arr_no_initial.length});`);
                    // Generate Initial Deposit Boilerplate For Each Token (Divisors,
                    // Swap "Balance" (Amount Deposited) For Other Tokens)
                    for await (const outflow_obj of outflows_arr_no_initial) {
                        let token_obj = (await (0, utils_js_1.getTokenDetails)(outflow_obj.token_identifier));
                        let current_index = outflows_arr_no_initial.findIndex((outflowObj) => outflowObj.flow_identifier == outflow_obj.flow_identifier);
                        await appendNewLineInterFunction(`to_tokens_divs_arr[${current_index}] = ${base_step.divisor * outflows_arr_no_initial.length};`);
                        await appendNewLineInterFunction(`to_tokens_arr[${current_index}] = ${web3_1.default.utils.toChecksumAddress(token_obj.address)};`);
                    }
                    await appendNewLineInterFunction(`bytes[] memory depositEventArr = new bytes[](6);`);
                    await appendNewLineInterFunction(`bytes[6] memory depositEventArrFixed = [abi.encode(currentChainId), abi.encode(${web3_1.default.utils.toChecksumAddress(vault_deposit_token.address)}), abi.encode(to_tokens_arr), abi.encode(_amount), abi.encode(to_tokens_divs_arr), abi.encode(address(this))];`);
                    await appendNewLineInterFunction(`for (uint256 i = 0; i < depositEventArrFixed.length; i++) {
            depositEventArr[i] = depositEventArrFixed[i];
        }`);
                    await appendNewLineInterFunction(`emit CallbackEvent("lifibatchswap", "deposit_post", depositEventArr);`);
                    // Close Function
                    await appendNewLineInterContract(`}`);
                    spacing();
                }
            }
            else {
                // Generate Post-Deposit Function (To Be Called By External Offchain executorAddress With Retreived Data As An Array Of bytes)
                if (!wasPostDepositinit) {
                    wasPostDepositinit = true;
                    await appendNewLineInterContract(`// Post-Deposit Function (To Be Called By External Offchain executorAddress With Retreived Data As An Array Of bytes)
            // Triggers "Base Strategy" (Swaps + Base Steps)`);
                    await appendNewLineInterContract(`function deposit_post(bytes[] memory _arguments) public onlyExecutor {`);
                    await appendNewLineInterContract(`uint256 PRE_BALANCE = ${vault_deposit_token.symbol}_BALANCE;`);
                    await appendNewLineInterContract(`updateBalances();`);
                    await appendNewLineInterContract(`uint256 POST_BALANCE = ${vault_deposit_token.symbol}_BALANCE;`);
                    await appendNewLineInterFunction(`address[] memory _targets = abi.decode(_arguments[0], (address[]));`);
                    await appendNewLineInterFunction(`bytes[] memory _callData = abi.decode(_arguments[1], (bytes[]));`);
                    await appendNewLineInterFunction(`uint[] memory _nativeValues = abi.decode(_arguments[2], (uint[]));`);
                    await appendNewLineInterFunction(`bool success;`);
                    await appendNewLineInterFunction(`bytes memory result;`);
                    await appendNewLineInterFunction(`require(_targets.length == _callData.length, "Addresses Amount Does Not Match Calldata Amount");`);
                    await appendNewLineInterFunction(`for (uint i = 0; i < _targets.length; i++) {`);
                    await appendNewLineInterFunction3x(`(success, result) = _targets[i].call{value: _nativeValues[i]}(_callData[i]);`);
                    await appendNewLineInterFunction3x(`latestContractData = result;`);
                    await appendNewLineInterFunction(`}`);
                }
                // Updates Each Related Balance To The Balance Prior To Deposit - The current Contract Balance,
                // Which Equals To The Amount That Was Deposited.
                for await (let balance_val of balances_params_arr) {
                    let tokenSymbol = balance_val.value.split("_")[0];
                    let tokenBalanceVar = balance_val.value.split(" / activeDivisor")[0];
                    let sameTokensArr = [];
                    if (balance_val.value.split("_")[0] == vault_deposit_token.symbol) {
                        await appendNewLineInterFunction(`updateStepsDetails();`);
                        await appendNewLineInterFunction(`updateActiveStep(step_${base_step.step_identifier});`);
                        await appendNewLineInterFunction(`uint256 currentIterationBalance = ${tokenSymbol}.balanceOf(address(this));`);
                        await appendNewLineInterFunction(`if(currentIterationBalance == PRE_BALANCE) {`);
                        await appendNewLineInterFunction2x(`${tokenBalanceVar} = 0;`);
                        await appendNewLineInterFunction(`} else if (currentIterationBalance == POST_BALANCE) {`);
                        await appendNewLineInterFunction2x(`${tokenBalanceVar} = (POST_BALANCE - PRE_BALANCE) * activeDivisor;`);
                        await appendNewLineInterFunction(`} else if (currentIterationBalance < POST_BALANCE) {`);
                        await appendNewLineInterFunction2x(`${tokenBalanceVar} = (currentIterationBalance - PRE_BALANCE) * activeDivisor;`);
                        await appendNewLineInterFunction(`} else if (currentIterationBalance > POST_BALANCE) {`);
                        await appendNewLineInterFunction2x(`${tokenBalanceVar} = (currentIterationBalance - POST_BALANCE) * activeDivisor;`);
                        await appendNewLineInterFunction(`}`);
                    }
                    else {
                        await appendNewLineInterFunction(`updateStepsDetails();`);
                        await appendNewLineInterFunction(`updateActiveStep(step_${base_step.step_identifier});`);
                        await appendNewLineInterFunction(`${tokenBalanceVar} = (${tokenSymbol}.balanceOf(address(this)) - ${tokenBalanceVar}) * activeDivisor;`);
                    }
                }
                // Call The Actual Deposit Function(s) After Tokens Have Been Swapped
                await appendNewLineInterFunction(`func_${base_step.function_identifiers[0]}("deposit_post", [`);
                let fakeparamsarr = await (0, utils_js_1.createArrayByNumberInput)(step_func_details.number_of_parameters);
                for await (const fakeparam of fakeparamsarr) {
                    let fakeindex = fakeparamsarr.indexOf(fakeparam);
                    fakeindex == 0
                        ? await appendSameLine(`abi.encode("donotuseparamsever")`)
                        : appendSameLine(`, abi.encode("donotuseparamsever")`);
                }
                await appendSameLine(`]);`);
                if (is_current_last) {
                    await appendNewLineInterFunction(`updateBalances();`);
                    await appendNewLineInterContract(`}`);
                }
            }
        };
        // Execute Above Function For Each One Of The Base Steps
        for await (const basestep of base_steps) {
            await generateInitialDepositFunction(basestep, false);
        }
        for await (const basestep of base_steps) {
            await generateInitialDepositFunction(basestep, true);
        }
        // Withdraw Function For The Strategy Contract
        await appendNewLineInterContract(`function withdraw(uint256 _amount) public {`);
        await appendNewLineInterFunction(`require(_amount > 0, "Deposit must be above 0");`);
        await appendNewLineInterFunction(`require(userShares[msg.sender] >= _amount, "You do not have enough vault shares to withdraw that amount.");`);
        await appendNewLineInterFunction(`bytes[] memory dynamicArr = new bytes[](5);`);
        await appendNewLineInterFunction(`bytes[5] memory fixedArr = [abi.encode(msg.sender), abi.encode(_amount), abi.encode(reverseFunctions), abi.encode(reverseSteps), abi.encode(userShares[msg.sender])];`);
        await appendNewLineInterFunction(`dynamicArr[0] = fixedArr[0];`);
        await appendNewLineInterFunction(`dynamicArr[1] = fixedArr[1];`);
        await appendNewLineInterFunction(`dynamicArr[2] = fixedArr[2];`);
        await appendNewLineInterFunction(`dynamicArr[3] = fixedArr[3];`);
        await appendNewLineInterFunction(`dynamicArr[4] = fixedArr[4];`);
        await appendNewLineInterFunction(`userShares[msg.sender] -= _amount;`);
        await appendNewLineInterFunction(`totalVaultShares -= _amount;`);
        await appendNewLineInterFunction(`emit CallbackEvent("reverseStrategy", "withdraw", dynamicArr);`);
        await appendNewLineInterContract(`}`);
        // Withdraw Post Function For The Strategy Contract
        await appendNewLineInterContract(`function withdraw_post(bool _success, uint256 _preShares, address _userAddress) public onlyExecutor {`);
        await appendNewLineInterFunction(`uint256 preChangeShares = userShares[_userAddress];`);
        await appendNewLineInterFunction(`if (!_success) {`);
        await appendNewLineInterFunction2x(`totalVaultShares += (_preShares - preChangeShares);`);
        await appendNewLineInterFunction(`userShares[_userAddress] = _preShares;`);
        await appendNewLineInterFunction(`} else {`);
        await appendNewLineInterFunction2x(`emit Withdraw(_userAddress, _preShares - preChangeShares);`);
        await appendNewLineInterFunction(`}`);
        await appendNewLineInterContract(`}`);
        // Post-Callback generic function
        spacing();
        await appendNewLineInterContract(`function callback_post(bytes[] memory _arguments) public onlyExecutor returns (bool){`);
        await appendNewLineInterFunction(`address[] memory _targets = abi.decode(_arguments[0], (address[]));`);
        await appendNewLineInterFunction(`bytes[] memory _callDatas = abi.decode(_arguments[1], (bytes[]));`);
        appendNewLineInterFunction(`uint256[] memory _nativeValues = abi.decode(_arguments[2], (uint256[]));`);
        await appendNewLineInterFunction(`require(_targets.length == _callDatas.length, "Lengths of targets and callDatas must match");`);
        await appendNewLineInterFunction(`bool success;`);
        await appendNewLineInterFunction(`bytes memory result;`);
        await appendNewLineInterFunction(`for (uint i = 0; i < _targets.length; i++) {`);
        await appendNewLineInterFunction3x(`(success, result) = _targets[i].call{value: _nativeValues[i]}(_callDatas[i]);`);
        await appendNewLineInterFunction(`require(success, "Function Call Failed On callback_post, Strategy Execution Aborted");`);
        await appendNewLineInterFunction3x(`latestContractData = result;`);
        await appendNewLineInterFunction(`}`);
        await appendNewLineInterFunction(`return true;`);
        await appendNewLineInterContract(`}`);
        const createCloneManager = async () => {
            await writeToFile(`${name}Factory.sol`, `// SPDX-License-Identifier: MIT`);
            await appendNewLineShortcutFactory(`pragma solidity ^0.8.9;`);
            await appendNewLineShortcutFactory(`pragma experimental ABIEncoderV2;`);
            await appendNewLineShortcutFactory(`import "./chainlink/contracts/src/v0.8/AutomationCompatible.sol";`);
            await appendNewLineShortcutFactory(`import "./${file_name}";`);
            // await appendNewLineShortcutFactory(`import "@openzeppelin/contracts/proxy/Clones.sol";`);
            await appendNewLineShortcutFactory(``);
            await appendNewLineShortcutFactory(`contract ${name.replace(/\s/g, "")}Factory {`);
            await appendNewLineInterContractFactory(`address immutable strategyImplementation;`);
            await appendNewLineInterContractFactory(`mapping(address => address) public usersToFacets;`);
            await appendNewLineInterContractFactory(`mapping(address => uint) public shares;`);
            await appendNewLineInterContractFactory(`uint public totalShares;`);
            await appendNewLineInterContractFactory(`address[] public users_arr;`);
            await appendNewLineInterContractFactory(`address[] internal facets_arr;`);
            await appendNewLineInterContractFactory(`address public immutable automatorContract;`);
            await appendNewLineInterContractFactory(`uint256 public upKeepID;`);
            await appendNewLineInterContractFactory(`uint256 public lastTimestamp;`);
            await appendNewLineInterContractFactory(`uint256 public interval = ${exec_interval};`);
            // Constructor
            await appendNewLineInterContractFactory(`constructor(string memory _name, address memory _automatorContract) {`);
            await appendNewLineInterFunctionFactory(`automatorContract = _automatorContract;`);
            await appendNewLineInterFunctionFactory(`lastTimestamp = block.timestamp;`);
            await appendNewLineInterFunctionFactory(`InitiateUpkeep();`);
            await appendNewLineInterContractFactory(`}`);
            // Modifiers
            await appendNewLineInterContractFactory(`modifier isAutomator() {`);
            await appendNewLineInterFunctionFactory(`require(msg.sender == automatorContract);`);
            await appendNewLineInterFunctionFactory(`_;`);
            await appendNewLineInterContractFactory(`}`);
            // Events
            await appendNewLineInterContractFactory(`event Deposit(address indexed sender, uint256 indexed amount);`);
            await appendNewLineInterContractFactory(`event Withdraw(address indexed sender, uint256 indexed amount);`);
            /* Functions */
            /**************
             * @Chainlink
             *************/
            // Automator Utility (Sets the upkeep ID for the contract (Called by automation manager only))
            await appendNewLineInterContractFactory(`function setUpkeepId(uint256 _upkeepId) public isAutomator {`);
            await appendNewLineInterFunctionFactory(`upKeepID = _upkeepId;`);
            await appendNewLineInterContractFactory(`}`);
            // Automator Utility (Initiate Upkeep (Called in Constructor))
            await appendNewLineInterContractFactory(`function InitiateUpkeep() public {`);
            await appendNewLineInterFunctionFactory(`(bool success, bytes memory result) = automatorContract.call(`);
            await appendNewLineInterFunction2xFactory(`abi.encodeWithSignature(`);
            await appendNewLineInterFunction3xFactory(`"registerAndPredictId(string,uint96)",`);
            await appendNewLineInterFunction3xFactory(`"${name}",`);
            await appendNewLineInterFunction3xFactory(`5000000000000000000`);
            await appendNewLineInterFunction2xFactory(`)`);
            await appendNewLineInterFunctionFactory(`);`);
            await appendNewLineInterContractFactory(`}`);
            // Automator Utility (Fund Gas Baance)
            await appendNewLineInterContractFactory(`function fundGasBalance(uint256 _amountLinkTokens) public {`);
            await appendNewLineInterFunctionFactory(`automatorContract.call(`);
            await appendNewLineInterFunction2xFactory(`abi.encodeWithSignature(`);
            await appendNewLineInterFunction3xFactory(`"fundStrategyGasBalance(uint256,uint96)",`);
            await appendNewLineInterFunction3xFactory(`upKeepID,`);
            await appendNewLineInterFunction3xFactory(`_amountLinkTokens`);
            await appendNewLineInterFunction2xFactory(`)`);
            await appendNewLineInterFunctionFactory(`);`);
            await appendNewLineInterContractFactory(`}`);
            // ChainLink Interface Utility (Check Upkeep (Check Condition))
            await appendNewLineInterContractFactory(`function checkUpkeep(`);
            await appendNewLineInterFunctionFactory(`bytes calldata /* checkData */)`);
            await appendNewLineInterFunctionFactory(`external`);
            await appendNewLineInterFunctionFactory(`view`);
            await appendNewLineInterFunctionFactory(`override`);
            await appendNewLineInterFunctionFactory(`returns (`);
            await appendNewLineInterFunction2xFactory(`bool upkeepNeeded,`);
            await appendNewLineInterFunction2xFactory(`bytes memory /* performData */`);
            await appendNewLineInterFunctionFactory(`)`);
            await appendNewLineInterContractFactory(`{`);
            await appendNewLineInterFunctionFactory(`upkeepNeeded = (block.timestamp - lastTimestamp) > interval;`);
            await appendNewLineInterContractFactory(`}`);
            // ChainLink Interface Utility (Perform Upkeep (run strategy))
            await appendNewLineInterContract(`function performUpkeep(`);
            await appendNewLineInterFunction(`bytes calldata /* performData */`);
            await appendNewLineInterContract(`) external override {`);
            await appendNewLineInterFunction(`if ((block.timestamp - lastTimestamp) > interval) {`);
            await appendNewLineInterFunction2x(`lastTimestamp = block.timestamp;`);
            await appendNewLineInterFunction2x(`strategyRunNeeded();`);
            await appendNewLineInterFunction(`}`);
            await appendNewLineInterContract(`}`);
            // Deposit Into Existing Facet Function
            await appendNewLineInterContract(`function depositIntoFacet(uint _amount, address memory depositer) internal {`);
            await appendNewLineInterFunction(`if (usersToFacets[msg.sender] > 0) {`);
            await appendNewLineInterFunction2x(`(bool success, bytes memory result) = usersToFacets[depositer].delegatecall(abi.encodeWithSignature("deposit(uint256)", _amount));`);
            await appendNewLineInterFunction2xFactory(`require(success, "Deposit Failed");`);
            await appendNewLineInterFunction2xFactory(`shares[depositer] += _amount;`);
            await appendNewLineInterFunction2xFactory(`totalShares += _amount;`);
            await appendNewLineInterFunction2xFactory(`emit Deposit(msg.sender, usersToFacets[msg.sender], _amount);`);
            await appendNewLineInterFunctionFactory(`}`);
            await appendNewLineInterContractFactory(`}`);
            // Withdraw From Existing Facet
            await appendNewLineInterContractFactory(`function withdrawFromFacet(uint _amount) public {`);
            await appendNewLineInterFunctionFactory(`require(_amount > 0, "Amount To Withdraw Must Be Bigger Than 0");`);
            await appendNewLineInterFunctionFactory(`require(_amount >= shares[msg.sender], "You Don't Have That Many Funds Deposited");`);
            await appendNewLineInterFunction2xFactory(`(bool success, bytes memory result) = usersToFacets[msg.sender].delegatecall(abi.encodeWithSignature("withdraw(uint256)", _amount));`);
            await appendNewLineInterFunction2xFactory(`require(success, "Withdrawl Failed");`);
            await appendNewLineInterFunction2xFactory(`shares[depositer] -= _amount;`);
            await appendNewLineInterFunction2xFactory(`totalShares -= _amount;`);
            await appendNewLineInterFunction2xFactory(`emit Withdraw(msg.sender, usersToFacets[msg.sender], _amount);`);
            await appendNewLineInterFunctionFactory(`}`);
            // Handle First-Time Depositor
            await appendNewLineInterContractFactory(`function handleNewUser(uint _amount, address memory depositer) internal {`);
            await appendNewLineInterFunctionFactory(`if (usersToFacets[depositer] <= 0) {`);
            await appendNewLineInterFunction2xFactory(`address clone = Clones.clone(strategyImplementation);`);
            await appendNewLineInterFunction2xFactory(`${name}(clone).initialize(msg.sender);`);
            await appendNewLineInterFunction2xFactory(`usersToFacets[depositer] = clone;`);
            await appendNewLineInterFunction2xFactory(`users_arr.push(depositer);`);
            await appendNewLineInterFunction2xFactory(`facets_arr.push(clone);`);
            await appendNewLineInterFunction2xFactory(`depositIntoFacet(_amount, depositer);`);
            await appendNewLineInterFunctionFactory(`}`);
            await appendNewLineInterContractFactory(`}`);
            // Head Deposit Handler
            await appendNewLineInterContractFactory(`function depositHandler(uint _amount) public {`);
            await appendNewLineInterFunctionFactory(`if (usersToFacets[msg.sender] > 0) {`);
            await appendNewLineInterFunction2xFactory(`depositIntoFacet(_amount, msg.sender);`);
            await appendNewLineInterFunctionFactory(`} else if (usersToFacets[msg.sender] <= 0) {`);
            await appendNewLineInterFunction2xFactory(`handleNewUser(_amount, msg.sender);`);
            await appendNewLineInterFunctionFactory(`}`);
            await appendNewLineInterContractFactory(`}`);
            /**************************************/
            await appendNewLineInterContractFactory(`}`);
        };
        /**
         * @notice
         * Generating All of the Generic Boilerplate First, before proceeding with more custom stuff
         */
        // return {
        //   base_tokens_addresses:
        // }
    };
    await initiateSolFile();
    await generateAdditionalBoilerplate();
    let init_flows = [];
    for await (const pool of init_strategy_obj.base_steps) {
        let res = await axios_1.default.get(`https://api.yieldchain.io/address-flows/${pool.address_identifiers[0]}`);
        for await (const item of res.data.address_flows) {
            init_flows.push(item);
        }
        return init_flows;
    }
};
exports.initStrategy = initStrategy;
//# sourceMappingURL=init-strategy.js.map