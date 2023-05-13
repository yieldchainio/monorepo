import { getStepDetails } from "./get-step.js";
const stepIDsToSteps = async (_steps, _provider, _contractAddress) => {
    let newArr = await Promise.all(_steps.map(async (stepId) => {
        let stepDetails = await getStepDetails(_provider, _contractAddress, Number(stepId));
        return {
            ...stepDetails,
            stepId: Number(stepId),
        };
    }));
    return newArr;
};
export default stepIDsToSteps;
//# sourceMappingURL=map-raw-steps.js.map