import axios from "axios";
/**
 * Get the full arguments details of a function
 * @param fullFunc
 * @returns
 */
export const getFunctionParams = async (fullFunc) => {
    let allParams = await (await axios.get("https://api.yieldchain.io/parameters")).data.parameters;
    let functionArgumentIDs = fullFunc.arguments;
    let funcArguments = allParams
        .filter((p) => functionArgumentIDs.includes(p.parameter_identifier))
        .map((p) => {
        return {
            parameter_identifier: p.parameter_identifier,
            value: p.value,
            solidity_type: p.solidity_type,
            name: p.name,
            index: p.index,
        };
    });
    return funcArguments;
};
//# sourceMappingURL=get-func-params.js.map