import axios from "axios";
export const getFullFunc = async (func) => {
    let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
        .data.functions;
    let fullFunc = allFunctions.find((f) => f.function_identifier === func);
    return fullFunc;
};
//# sourceMappingURL=id-to-dbfunc.js.map