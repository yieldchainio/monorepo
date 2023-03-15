import { useState, useEffect } from "react";
import styles from "./css/maincss.module.css";
import axios from "axios";
import {
  DBAction,
  DBNetwork,
  DBProtocol,
  DropdownOptions,
  IntegrateAbleFunction,
} from "./types";
import DropdownInput from "./DropdownInput";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { getAddressDetails } from "./scripts/get-address-details";
import { IFlow } from "./scripts/map-funcs-to-flows";
import { FunctionTableRow } from "./FunctionRow";
import { LoadingScreen } from "./LoadingScreen";
import { integrateIntoDB } from "./scripts/integration";
import { IntegrationInterface } from "./scripts/integration";

export interface IFullArg {
  name: string;
  tempId: number;
  type: string;
  value: string | null;
  group_id: number;
}

export interface IFullFunction {
  tempId: number;
  name: string;
  args: IFullArg[];
  flows: IFlow[];
  txnsAmount: number;
  counterFuncId: number | null;
  unlockedByFuncId: number | null;
  chosen: boolean;
  actionId?: number;
  chosenFlows?: IFlow[];
}

function App() {
  /**
   * @DB Fetched Options for the protocol & network
   */
  const [networks, setNetworks] = useState<DBNetwork[] | null>(null);
  const [protocols, setProtocols] = useState<DBProtocol[] | null>(null);
  const [actions, setActions] = useState<DBAction[] | null>(null);

  /**
   * @User Options
   */
  const [abi, setABI] = useState<any[] | null>(null);
  const [network, setNetwork] = useState<DBNetwork | null>(null);
  const [protocol, setProtocol] = useState<DBProtocol | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [functions, setFunctions] = useState<IFullFunction[]>([]);
  const [chosenFunctions, setChosenFunctions] = useState<IFullFunction[]>([]);

  useEffect(() => {
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
        alert(
          "Please select an action for function " +
            func.name +
            ` (ID ${func.tempId})`
        );
        console.log("Gay Much");
        return;
      }
      for (const arg of func.args) {
        if (arg.value === null) {
          alert(
            "Please enter a value for argument " +
              arg.name +
              `(ID ${arg.tempId})`
          );
          return;
        }
      }

      let chosenFlows = func.flows.filter(
        (flow: IFlow) => flow?.chosen === true
      );
      // Alert user that a function has no flows, ask if to continue or not
      if (!chosenFlows.length && func.flows.length > 0) {
        if (
          !window.confirm(
            "Function " + func.name + " has no flows chosen, continue?"
          )
        )
          return;
      }

      func.flows = chosenFlows;
    }

    let integrateAbleFunctions = chosenFunctions.filter(
      (func: IFullFunction) => func.actionId !== null && func.actionId !== -1
    ) as IntegrateAbleFunction[];

    let integrationInterface: IntegrationInterface = {
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
    let result = await integrateIntoDB(integrationInterface);

    if (result === true) alert("Integration Successful");
    else alert("Integration Failed");
  };

  // Handle functions add/removal
  const handleFunctionChoice = (func: IFullFunction) => {
    // Deep Cloning Array
    let newArr = [...chosenFunctions];

    // If func is chosen, we add it to the array
    if (func.chosen) {
      // Index of it in existing array
      let indexOfFunc = newArr.findIndex(
        (_func: IFullFunction) => _func.tempId === func.tempId
      );

      // If it is there, we just change it
      if (indexOfFunc !== -1) newArr[indexOfFunc] = func;
      // Else we push it
      else newArr.push(func);

      // If its not chosen, we remove it from the array
    } else {
      newArr = newArr.filter((f) => f.tempId !== func.tempId);
    }
    setChosenFunctions(newArr);
    setFunctions((prev: IFullFunction[]) => {
      let newArr = [...prev];
      let index = newArr.findIndex((f) => f.tempId === func.tempId);
      newArr[index] = func;
      return newArr;
    });
  };

  // Handle Function Removal
  const handleFunctionRemoval = (index: number) => {
    let func = functions[index];
    // Alert user to confirm if they want to proceed
    if (
      !window.confirm(
        "Are you sure you want to remove function " + func.name + "?"
      )
    )
      return;
    // Remove the function from the array
    else
      setFunctions((prev: IFullFunction[]) => {
        let newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      });
  };

  // Called when a contract is chosen to be fetched
  const handleContractChoice = async (address: string, network: DBNetwork) => {
    setLoading((prev: any[]) => [...prev, true]);
    console.log("Getting details for address", address, network);
    let res: { functions: IFullFunction[]; abi: any[] } =
      await getAddressDetails(address, network);
    setFunctions(res.functions);
    setABI(res.abi);
    setLoading((prev: any[]) => {
      let newArr = [...prev];
      newArr.pop();
      return newArr;
    });
  };

  // @notice
  // We use this array to determine whether items are still loading or not
  const [loading, setLoading] = useState<any[]>([true, true]);

  /**
   * @API Calls to fetch the options for the protocol & network
   */
  useEffect(() => {
    axios.get("https://api.yieldchain.io/networks").then((res) => {
      setNetworks(res.data.networks);
    });
    axios.get("https://api.yieldchain.io/protocols").then((res) => {
      setProtocols(res.data.protocols);
    });

    axios.get("https://api.yieldchain.io/actions").then((res) => {
      setActions(res.data.actions);
    });

    return () => {
      setNetworks(null);
      setProtocols(null);
      setActions(null);
    };
  }, []);

  useEffect(() => {
    console.log("Address Changed", address);
  }, [address]);

  // Updating the loading state
  useEffect(() => {
    if (networks !== null)
      setLoading((prev: any) => {
        let newArr = [...prev];
        newArr.pop();
        return newArr;
      });
    if (protocols !== null)
      setLoading((prev: any) => {
        let newArr = [...prev];
        newArr.pop();
        return newArr;
      });
  }, [networks, protocols]);

  // If loading is not empty, we return a loading screen
  if (loading.length > 0) {
    return (
      <div>
        <LoadingScreen />;
      </div>
    );
    // If loading is empty, we return the main page
  } else
    return (
      <body
        style={{
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        <div className={styles.main}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2.5%",
            }}
            onClick={() => getIntegrationObject()}
          >
            <div className={styles.mainText}>YC Admin</div>
            <div className={styles.mainText}>Inegration Form</div>
          </div>
          <div className={styles.firstFieldsContainer}>
            <div className={styles.singleFieldContainer}>
              <div className={styles.fieldTitleText}>Network</div>
              {networks && (
                <DropdownInput
                  options={networks?.map((network: DBNetwork) => {
                    return {
                      label: network.name,
                      data: network,
                      image: network.logo,
                    } as DropdownOptions<DBNetwork>;
                  })}
                  placeholder={
                    network
                      ? {
                          label: network.name,
                          data: network,
                          image: network.logo,
                        }
                      : {
                          label: "Select Network",
                        }
                  }
                  choiceHandler={setNetwork}
                />
              )}
            </div>
            <div className={styles.singleFieldContainer}>
              <div className={styles.fieldTitleText}>Protocol</div>
              {protocols && (
                <DropdownInput
                  options={protocols?.map((protocol: DBProtocol) => {
                    return {
                      label: protocol.name,
                      data: protocol,
                      image: protocol.logo,
                    } as DropdownOptions<DBProtocol>;
                  })}
                  choiceHandler={setProtocol}
                  placeholder={
                    protocol
                      ? {
                          label: protocol.name,
                          data: protocol,
                          image: protocol.logo,
                        }
                      : {
                          label: "Select Protocol",
                        }
                  }
                />
              )}
            </div>
            <div className={styles.singleFieldContainer}>
              <div className={styles.fieldTitleText}>Contract Address</div>
              <TextInput
                type={"text"}
                placeholder="0x00000000000000000"
                onChange={setAddress}
                value={address}
              />
              <Button
                text={"Fetch Details"}
                onClick={handleContractChoice}
                onClickArgs={[address, network]}
              />
            </div>
          </div>
          <div className={styles.functionsTable} style={{ marginLeft: "10vw" }}>
            <div className={styles.functionsTableRow}>
              <div className={styles.functionsTableColumn}>
                <div className={styles.functionsTableTitle}>Temp ID</div>{" "}
              </div>
              <div
                className={styles.functionsTableColumn}
                style={{ marginRight: "11vw" }}
              >
                <div className={styles.functionsTableTitle}>Name</div>{" "}
              </div>
              <div
                className={styles.functionsTableColumn}
                style={{
                  marginRight: "-5vw",
                }}
              >
                <div className={styles.functionsTableTitle}>
                  Counter Func TID
                </div>{" "}
              </div>
              <div className={styles.functionsTableColumn}>
                <div className={styles.functionsTableTitle}>
                  Unlocked By TID
                </div>{" "}
              </div>
              <div
                className={styles.functionsTableColumn}
                style={{
                  marginLeft: "-3vw",
                }}
              >
                <div className={styles.functionsTableTitle}>Action</div>{" "}
              </div>
              <div
                className={styles.functionsTableColumn}
                style={{
                  marginLeft: "3vw",
                }}
              >
                <div className={styles.functionsTableTitle}>Include</div>{" "}
              </div>
            </div>
            {functions &&
              functions.map((func: IFullFunction, index: number) => {
                return (
                  <FunctionTableRow
                    tempId={func.tempId}
                    name={func.name}
                    flows={func.flows}
                    args={func.args}
                    txnsAmount={func.txnsAmount}
                    otherFuncIds={functions
                      .filter(
                        (_func: IFullFunction) => _func.tempId !== func.tempId
                      )
                      .map((_func: IFullFunction) => _func.tempId)}
                    actions={actions ? actions : []}
                    choiceHandler={handleFunctionChoice}
                    address={address || ""}
                    index={index}
                    removalHandler={handleFunctionRemoval}
                  />
                );
              })}
          </div>
          <Button
            text={"Integrate"}
            style={{
              marginTop: "10vh",
              backgroundImage: "linear-gradient(to right, #00b09b, #96c93d)",
            }}
            onClick={handleIntegrationClick}
          />
        </div>
      </body>
    );
}

export default App;
