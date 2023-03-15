"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const axios_1 = __importDefault(require("axios"));
const DropdownInput_1 = __importDefault(require("./DropdownInput"));
const TextInput_1 = require("./TextInput");
const Button_1 = require("./Button");
const get_address_details_1 = require("./scripts/get-address-details");
const FunctionRow_1 = require("./FunctionRow");
const LoadingScreen_1 = require("./LoadingScreen");
const integration_1 = require("./scripts/integration");
function App() {
    /**
     * @DB Fetched Options for the protocol & network
     */
    const [networks, setNetworks] = (0, react_1.useState)(null);
    const [protocols, setProtocols] = (0, react_1.useState)(null);
    const [actions, setActions] = (0, react_1.useState)(null);
    /**
     * @User Options
     */
    const [abi, setABI] = (0, react_1.useState)(null);
    const [network, setNetwork] = (0, react_1.useState)(null);
    const [protocol, setProtocol] = (0, react_1.useState)(null);
    const [address, setAddress] = (0, react_1.useState)(null);
    const [functions, setFunctions] = (0, react_1.useState)([]);
    const [chosenFunctions, setChosenFunctions] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        console.log("Network Changed", network);
    }, [network]);
    const getIntegrationObject = () => {
        if (network === null) {
            alert("Please select a network");
            return;
        }
        if (protocol === null) {
            alert("Please select a protocol");
            return;
        }
        if (address === null) {
            alert("Please enter an address");
            return;
        }
        if (chosenFunctions.length <= 0) {
            alert("Please select at least one function");
            return;
        }
        if (abi === null) {
            alert("Please enter an ABI");
            return;
        }
        for (const func of chosenFunctions) {
            console.log("Func Ser", func);
            if (func.actionId === (null || -1 || undefined)) {
                alert("Please select an action for function " +
                    func.name +
                    ` (ID ${func.tempId})`);
                console.log("Gay Much");
                return;
            }
            for (const arg of func.args) {
                if (arg.value === null) {
                    alert("Please enter a value for argument " +
                        arg.name +
                        `(ID ${arg.tempId})`);
                    return;
                }
            }
            let chosenFlows = func.flows.filter((flow) => (flow === null || flow === void 0 ? void 0 : flow.chosen) === true);
            // Alert user that a function has no flows, ask if to continue or not
            if (!chosenFlows.length && func.flows.length > 0) {
                if (!window.confirm("Function " + func.name + " has no flows chosen, continue?"))
                    return;
            }
            func.flows = chosenFlows;
        }
        let integrateAbleFunctions = chosenFunctions.filter((func) => func.actionId !== null && func.actionId !== -1);
        let integrationInterface = {
            functions: integrateAbleFunctions,
            contract_address: address,
            protocol_identifier: protocol.protocol_identifier,
            chain_id: network.chain_id,
            abi: abi,
            network: network,
        };
        console.log("Integration Interface", integrationInterface);
        return integrationInterface;
    };
    const handleIntegrationClick = async () => {
        let integrationInterface = getIntegrationObject();
        if (integrationInterface === undefined) {
            return;
        }
        let result = await (0, integration_1.integrateIntoDB)(integrationInterface);
        if (result === true)
            alert("Integration Successful");
        else
            alert("Integration Failed");
    };
    // Handle functions add/removal
    const handleFunctionChoice = (func) => {
        // Deep Cloning Array
        let newArr = [...chosenFunctions];
        // If func is chosen, we add it to the array
        if (func.chosen) {
            // Index of it in existing array
            let indexOfFunc = newArr.findIndex((_func) => _func.tempId === func.tempId);
            // If it is there, we just change it
            if (indexOfFunc !== -1)
                newArr[indexOfFunc] = func;
            // Else we push it
            else
                newArr.push(func);
            // If its not chosen, we remove it from the array
        }
        else {
            newArr = newArr.filter((f) => f.tempId !== func.tempId);
        }
        setChosenFunctions(newArr);
        setFunctions((prev) => {
            let newArr = [...prev];
            let index = newArr.findIndex((f) => f.tempId === func.tempId);
            newArr[index] = func;
            return newArr;
        });
    };
    // Handle Function Removal
    const handleFunctionRemoval = (index) => {
        let func = functions[index];
        // Alert user to confirm if they want to proceed
        if (!window.confirm("Are you sure you want to remove function " + func.name + "?"))
            return;
        // Remove the function from the array
        else
            setFunctions((prev) => {
                let newArr = [...prev];
                newArr.splice(index, 1);
                return newArr;
            });
    };
    // Called when a contract is chosen to be fetched
    const handleContractChoice = async (address, network) => {
        setLoading((prev) => [...prev, true]);
        console.log("Getting details for address", address, network);
        let res = await (0, get_address_details_1.getAddressDetails)(address, network);
        setFunctions(res.functions);
        setABI(res.abi);
        setLoading((prev) => {
            let newArr = [...prev];
            newArr.pop();
            return newArr;
        });
    };
    // @notice
    // We use this array to determine whether items are still loading or not
    const [loading, setLoading] = (0, react_1.useState)([true, true]);
    /**
     * @API Calls to fetch the options for the protocol & network
     */
    (0, react_1.useEffect)(() => {
        axios_1.default.get("https://api.yieldchain.io/networks").then((res) => {
            setNetworks(res.data.networks);
        });
        axios_1.default.get("https://api.yieldchain.io/protocols").then((res) => {
            setProtocols(res.data.protocols);
        });
        axios_1.default.get("https://api.yieldchain.io/actions").then((res) => {
            setActions(res.data.actions);
        });
        return () => {
            setNetworks(null);
            setProtocols(null);
            setActions(null);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        console.log("Address Changed", address);
    }, [address]);
    // Updating the loading state
    (0, react_1.useEffect)(() => {
        if (networks !== null)
            setLoading((prev) => {
                let newArr = [...prev];
                newArr.pop();
                return newArr;
            });
        if (protocols !== null)
            setLoading((prev) => {
                let newArr = [...prev];
                newArr.pop();
                return newArr;
            });
    }, [networks, protocols]);
    // If loading is not empty, we return a loading screen
    if (loading.length > 0) {
        return (<div>
        <LoadingScreen_1.LoadingScreen />;
      </div>);
        // If loading is empty, we return the main page
    }
    else
        return (<body style={{
                overflowX: "hidden",
                overflowY: "hidden",
            }}>
        <div className={maincss_module_css_1.default.main}>
          <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2.5%",
            }} onClick={() => getIntegrationObject()}>
            <div className={maincss_module_css_1.default.mainText}>YC Admin</div>
            <div className={maincss_module_css_1.default.mainText}>Inegration Form</div>
          </div>
          <div className={maincss_module_css_1.default.firstFieldsContainer}>
            <div className={maincss_module_css_1.default.singleFieldContainer}>
              <div className={maincss_module_css_1.default.fieldTitleText}>Network</div>
              {networks && (<DropdownInput_1.default options={networks === null || networks === void 0 ? void 0 : networks.map((network) => {
                    return {
                        label: network.name,
                        data: network,
                        image: network.logo,
                    };
                })} placeholder={network
                    ? {
                        label: network.name,
                        data: network,
                        image: network.logo,
                    }
                    : {
                        label: "Select Network",
                    }} choiceHandler={setNetwork}/>)}
            </div>
            <div className={maincss_module_css_1.default.singleFieldContainer}>
              <div className={maincss_module_css_1.default.fieldTitleText}>Protocol</div>
              {protocols && (<DropdownInput_1.default options={protocols === null || protocols === void 0 ? void 0 : protocols.map((protocol) => {
                    return {
                        label: protocol.name,
                        data: protocol,
                        image: protocol.logo,
                    };
                })} choiceHandler={setProtocol} placeholder={protocol
                    ? {
                        label: protocol.name,
                        data: protocol,
                        image: protocol.logo,
                    }
                    : {
                        label: "Select Protocol",
                    }}/>)}
            </div>
            <div className={maincss_module_css_1.default.singleFieldContainer}>
              <div className={maincss_module_css_1.default.fieldTitleText}>Contract Address</div>
              <TextInput_1.TextInput type={"text"} placeholder="0x00000000000000000" onChange={setAddress} value={address}/>
              <Button_1.Button text={"Fetch Details"} onClick={handleContractChoice} onClickArgs={[address, network]}/>
            </div>
          </div>
          <div className={maincss_module_css_1.default.functionsTable} style={{ marginLeft: "10vw" }}>
            <div className={maincss_module_css_1.default.functionsTableRow}>
              <div className={maincss_module_css_1.default.functionsTableColumn}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>Temp ID</div>{" "}
              </div>
              <div className={maincss_module_css_1.default.functionsTableColumn} style={{ marginRight: "11vw" }}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>Name</div>{" "}
              </div>
              <div className={maincss_module_css_1.default.functionsTableColumn} style={{
                marginRight: "-5vw",
            }}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>
                  Counter Func TID
                </div>{" "}
              </div>
              <div className={maincss_module_css_1.default.functionsTableColumn}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>
                  Unlocked By TID
                </div>{" "}
              </div>
              <div className={maincss_module_css_1.default.functionsTableColumn} style={{
                marginLeft: "-3vw",
            }}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>Action</div>{" "}
              </div>
              <div className={maincss_module_css_1.default.functionsTableColumn} style={{
                marginLeft: "3vw",
            }}>
                <div className={maincss_module_css_1.default.functionsTableTitle}>Include</div>{" "}
              </div>
            </div>
            {functions &&
                functions.map((func, index) => {
                    return (<FunctionRow_1.FunctionTableRow tempId={func.tempId} name={func.name} flows={func.flows} args={func.args} txnsAmount={func.txnsAmount} otherFuncIds={functions
                            .filter((_func) => _func.tempId !== func.tempId)
                            .map((_func) => _func.tempId)} actions={actions ? actions : []} choiceHandler={handleFunctionChoice} address={address || ""} index={index} removalHandler={handleFunctionRemoval}/>);
                })}
          </div>
          <Button_1.Button text={"Integrate"} style={{
                marginTop: "10vh",
                backgroundImage: "linear-gradient(to right, #00b09b, #96c93d)",
            }} onClick={handleIntegrationClick}/>
        </div>
      </body>);
}
exports.default = App;
//# sourceMappingURL=App.js.map