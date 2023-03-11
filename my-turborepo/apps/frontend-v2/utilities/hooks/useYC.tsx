// import { useState, useEffect } from "react";
// import { YCClassifications } from "@libs/yc-models/yc/classification";
// import YCToken from "@libs/yc-models/yc/YCToken";
// import YCNetwork from "@libs/yc-models/yc/YCNetwork";
// import YCAddress from "@libs/yc-models/yc/YCAddress";
// import YCFlow from "@libs/yc-models/yc/YCFlow";
// import YCArgument from "@libs/yc-models/yc/YCArg";
// import YCFunc from "@libs/yc-models/yc/YCFunc";
// import { YCProtocol } from "@libs/yc-models/yc/YCProtocol";
// import YCAction from "@libs/yc-models/yc/YCAction";
// import YCUser from "@libs/yc-models/yc/YCUser";

// /**
//  * @notice
//  * useYC
//  * A Custom hook for using (cached) YC Data
//  */
// export const useYC = () => {
//   // Initiallizing the context class
//   const [context, setContext] = useState<YCClassifications>(
//     new YCClassifications()
//   );

//   // A boolean indiciating whether the context has been initiallized or not
//   const [initiallized, setInitiallized] = useState<boolean>(false);

//   // Initiallize the context
//   useEffect(() => {
//     (async () => {
//       await context.initiallize();
//       setInitiallized(true);
//     })();
//   }, []);

//   // A useEffect that

//   /**
//    * Initiallize endpoints
//    */

//   // YCTokens
//   const [tokens, setTokens] = useState<YCToken[]>();

//   // YCNetworks
//   const [networks, setNetworks] = useState<YCNetwork[]>();

//   // YCProtocols
//   const [protocols, setProtocols] = useState<YCProtocol[]>();

//   // YCActions
//   const [actions, setActions] = useState<YCAction[]>();

//   // YCFunctions
//   const [functions, setFunctions] = useState<YCFunc[]>();

//   // YCArguments
//   const [args, setArgs] = useState<YCArgument[]>();

//   // YCUsers
//   const [users, setUsers] = useState<YCUser[]>();

//   // YCAddresses
//   const [addresses, setAddresses] = useState<YCAddress[]>();

//   // YCFlows
//   const [flows, setFlows] = useState<YCFlow[]>();
// };

export {};
