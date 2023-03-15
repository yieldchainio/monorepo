// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import React, {
//   useEffect,
//   useState,
//   FunctionComponent,
//   useContext,
// } from "react";
// import axios from "axios";
// import styles from "../css/strategy-builder.module.css";
// import { motion } from "framer-motion";
// import { DatabaseContext } from "../Contexts/DatabaseContext";

// /* @dev
//  * Configuration Components for each action
//  **/

// export const Stake = (props: any) => {
//   /**
//    * Context of all needed data
//    */
//   const {
//     fullProtocolsList,
//     fullPoolsList,
//     fullNetworksList,
//     fullTokensList,
//     fullStrategiesList,
//   } = useContext(DatabaseContext);

//   const [poolChoice, setPoolChoice] = useState<any>("Choose Pool");
//   const [protocolChoice, setProtocolChoice] = useState<any>("Choose Protocol");
//   const [poolDropDownOpen, setPoolDropDownOpen] = useState<any>(false);
//   const [protocolDropDownOpen, setProtocolDropDownOpen] = useState<any>(false);

//   const [protocolsList, setProtocolsList] = useState<any>(undefined);
//   const [poolsList, setPoolsList] = useState<any>(undefined);
//   const [filteredPoolsList, setFilteredPoolsList] = useState<any>(undefined);

//   useEffect(() => {
//     (async () => {
//       const protocols = await axios.get("http://localhost:1337/protocols");
//       const pools = await axios.get("http://localhost:1337/pools");
//       setProtocolsList(protocols.data.protocols);
//       setPoolsList(pools.data.pools);
//     })();

//     return () => {
//       // this now gets called when the component unmounts
//     };
//   }, []);

//   const handleDropDownOpen = (_openedDropdown: any) => {
//     let mapping = new Map();
//     let statesMapping = new Map();
//     let stateSettersMapping = new Map();
//     mapping.set("protocol", "pool");
//     mapping.set("pool", "protocol");
//     statesMapping.set("protocol", protocolDropDownOpen);
//     statesMapping.set("pool", poolDropDownOpen);
//     stateSettersMapping.set("protocol", setProtocolDropDownOpen);
//     stateSettersMapping.set("pool", setPoolDropDownOpen);

//     let currentOpposite = mapping.get(_openedDropdown);
//     let currentInteraction = _openedDropdown;
//     let currentInteractionState = statesMapping.get(currentInteraction);
//     let currentOppositeState = statesMapping.get(currentOpposite);
//     let currentStateSetter = stateSettersMapping.get(currentInteraction);
//     let currentOppositeStateSetter = stateSettersMapping.get(currentOpposite);

//     if (currentOppositeState == false) {
//       currentStateSetter(!currentInteractionState);
//     } else {
//       currentOppositeStateSetter(!currentOppositeState);
//       currentStateSetter(!currentInteractionState);
//     }
//   };

//   const handleProtocolChoice = (_protocolDetailsObject: any) => {
//     if (_protocolDetailsObject !== "Choose Protocol") {
//
//       setProtocolChoice(_protocolDetailsObject);
//       setProtocolDropDownOpen(!protocolDropDownOpen);
//       let protocolsPoolsIds = Object.values(
//         _protocolDetailsObject.pools_json_arr
//       );
//       let temp_filtered_pools_list = poolsList.filter(
//         (pool: any, poolIndex: any) =>
//           protocolsPoolsIds.findIndex((item) => item == poolIndex + 1) !== -1
//       );
//       setFilteredPoolsList(temp_filtered_pools_list);
//     }
//   };

//   const handlePoolChoice = (_poolDetailsObject: any) => {
//
//     if (_poolDetailsObject !== "Choose Pool") {
//       setPoolChoice(_poolDetailsObject);
//       setPoolDropDownOpen(!poolDropDownOpen);
//     }
//   };

//   const ProtocolsDropdownContainer = () => {
//     const DropdownRow = (props: any) => {
//       return (
//         <motion.div
//           className={styles.dropDownChoiceRowContainer}
//           whileHover={{
//             backgroundColor: "rgba(15, 16, 17, 1)",
//             transition: { duration: 0.1 },
//           }}
//           onClick={() => handleProtocolChoice(props.protocolDetails)}
//         >
//           {/* Switch to props.poolimg */}
//           <img src="/cake.svg" alt="" className={styles.dropDownChoiceRowImg} />
//           <div className={styles.dropDownChoiceRowText}>
//             {props.protocolDetails.name}
//           </div>
//         </motion.div>
//       );
//     };

//     return (
//       <div className={styles.stakeDropdownContainer} style={{ top: "56px" }}>
//         <input
//           type="text"
//           className={styles.dropDownSearchContainer}
//           placeholder={"Search For Pool"}
//         />
//         <img
//           src="/searchicon.svg"
//           alt=""
//           className={styles.dropDownSearchIcon}
//         />
//         <div className={styles.dropDownChoicesContainer}>
//           {protocolsList !== undefined
//             ? protocolsList.map((protocolObj: any) => (
//                 <DropdownRow protocolDetails={protocolObj} />
//               ))
//             : () => undefined}
//         </div>
//       </div>
//     );
//   };

//   const PoolsDropdownContainer = () => {
//     const DropdownRow = (props: any) => {
//       return (
//         <motion.div
//           className={styles.dropDownChoiceRowContainer}
//           whileHover={{
//             backgroundColor: "rgba(15, 16, 17, 1)",
//             transition: { duration: 0.1 },
//           }}
//           onClick={() => handlePoolChoice(props.poolDetails)}
//         >
//           {/* Switch to props.poolimg */}
//           <img
//             src={props.poolDetails.deposit_token_logo}
//             alt=""
//             className={styles.dropDownChoiceRowImg}
//           />
//           <div className={styles.dropDownChoiceRowText}>
//             {toRegularCasing(props.poolDetails.deposit_token_name)}
//           </div>
//           <img
//             src="/dropdownrowarrowleft.svg"
//             alt=""
//             className={styles.dropDownRowArrowLeft}
//           />
//           <img
//             src={props.poolDetails.reward_token_logo}
//             alt=""
//             className={styles.dropDownChoiceRowImg}
//             style={{ left: "48px", width: "20px", height: "20px", top: "12px" }}
//           />
//           <div
//             className={styles.dropDownRowRewardText}
//             style={{ left: "58.3px" }}
//           >
//             {props.poolDetails.reward_token_name}
//           </div>
//         </motion.div>
//       );
//     };

//     return (
//       <div className={styles.stakeDropdownContainer}>
//         <input
//           type="text"
//           className={styles.dropDownSearchContainer}
//           placeholder={"Search For Pool"}
//         />
//         <img
//           src="/searchicon.svg"
//           alt=""
//           className={styles.dropDownSearchIcon}
//         />
//         <div className={styles.dropDownChoicesContainer}>
//           {filteredPoolsList !== undefined
//             ? filteredPoolsList.map((poolObj: any, index: number) => (
//                 <DropdownRow poolDetails={poolObj} key={index} />
//               ))
//             : () =>
//         </div>
//         {
//       </div>
//     );
//   };

//   return (
//     <div className={styles.stakeConfigurationContainer}>
//       <div className={styles.stakeConfigurationActionTitle}>Action</div>
//       <div className={styles.stakeConfigurationActionChose}>
//         <div className={styles.stakeConfigurationActionChoseText}>Stake</div>
//         <img
//           src="/dropdownarrowdown.svg"
//           alt=""
//           className={styles.stakeConfigurationActionChoseArrowDown}
//         />
//       </div>
//       <div
//         className={styles.stakeConfigurationActionTitle}
//         style={{ top: "144px" }}
//       >
//         Protocol
//       </div>
//       <button
//         className={styles.stakeConfigurationActionChose}
//         style={{ top: "176px" }}
//         onClick={() => handleDropDownOpen("protocol")}
//       >
//         {protocolChoice == "Choose Protocol" ? (
//           () => undefined
//         ) : (
//           <img
//             src={protocolChoice.logo}
//             alt=""
//             className={styles.choseProtocolImg}
//           />
//         )}
//         <div
//           className={styles.stakeConfigurationActionChoseText}
//           style={
//             protocolChoice == "Choose Protocol"
//               ? { opacity: "0.3" }
//               : { opacity: "1", left: "48px" }
//           }
//         >
//           {protocolChoice !== "Choose Protocol"
//             ? protocolChoice.name
//             : protocolChoice}
//         </div>

//         <img
//           src="/dropdownarrowdown.svg"
//           alt=""
//           className={styles.stakeConfigurationActionChoseArrowDown}
//         />
//       </button>
//       <div
//         className={styles.stakeConfigurationActionTitle}
//         style={{ top: "264px" }}
//         onClick={(e) =>
//       >
//         Pool
//       </div>
//       <button
//         className={styles.stakeConfigurationActionChose}
//         style={{ top: "296px" }}
//         onClick={() => handleDropDownOpen("pool")}
//       >
//         {poolChoice == "Choose Pool" ? (
//           () => undefined
//         ) : (
//           <img
//             src={poolChoice.deposit_token_logo}
//             alt=""
//             className={styles.choseProtocolImg}
//           />
//         )}
//         <div
//           className={styles.stakeConfigurationActionChoseText}
//           style={
//             poolChoice == "Choose Pool"
//               ? { opacity: "0.3" }
//               : { opacity: "1", left: "48px" }
//           }
//         >
//           {poolChoice == "Choose Pool"
//             ? poolChoice
//             : poolChoice.deposit_token_name}
//         </div>
//         {poolChoice == "Choose Pool" ? (
//           () => undefined
//         ) : (
//           <img
//             src="/routeleftarrow.svg"
//             className={styles.strategyTitleArrowLeft}
//             alt=""
//             style={{ left: "96px", top: "21.5px" }}
//           />
//         )}
//         {poolChoice == "Choose Pool" ? (
//           () => undefined
//         ) : (
//           <img
//             src={poolChoice.reward_token_logo}
//             alt=""
//             className={styles.dropDownChoiceRowImg}
//             style={{
//               width: "20px",
//               height: "20px",
//               position: "absolute",
//               top: "18px",
//               left: "116px",
//             }}
//           />
//         )}
//         {poolChoice == "Choose Pool" ? (
//           () => undefined
//         ) : (
//           <div
//             className={styles.stakeConfigurationActionChoseText}
//             style={{ left: "140px", top: "17px", fontSize: "12px" }}
//           >
//             {poolChoice.reward_token_name}
//           </div>
//         )}
//         <img
//           src="/dropdownarrowdown.svg"
//           alt=""
//           className={styles.stakeConfigurationActionChoseArrowDown}
//         />
//       </button>
//       <button
//         className={styles.configDoneBtn}
//         // onClick={props.stepsArrayFe.push(<FinishedBlock stepDetails={} />)}
//       >
//         + Add Step
//       </button>
//       <button className={styles.configCancelBtn}>Cancel Step</button>
//       {/* {protocolDropDownOpen !== false ? (
//        <ProtocolsDropdownContainer />
//      ) : undefined} */}
//       {poolDropDownOpen !== false ? <PoolsDropdownContainer /> : undefined}
//       {protocolDropDownOpen !== false ? (
//         <ProtocolsDropdownContainer />
//       ) : undefined}
//     </div>
//   );
// };

export {};
