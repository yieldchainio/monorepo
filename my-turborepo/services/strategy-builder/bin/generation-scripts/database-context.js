import axios from "axios";
export const GetDatabaseContext = async () => {
    let base_url = `https://api.yieldchain.io/`;
    let full_tokens_list = await axios.get(`${base_url}tokens`);
    let full_pools_list = await axios.get(`${base_url}addresses`);
    let full_protocols_list = await axios.get(`${base_url}protocols`);
    let full_flows_list = await axios.get(`${base_url}flows`);
    let full_functions_list = await axios.get(`${base_url}functions`);
    let full_parameters_list = await axios.get(`${base_url}parameters`);
    let full_networks_list = await axios.get(`${base_url}networks`);
    return {
        full_tokens_list: full_tokens_list,
        full_pools_list: full_pools_list,
        full_protocols_list: full_protocols_list,
        full_flows_list: full_flows_list,
        full_functions_list: full_functions_list,
        full_parameters_list: full_parameters_list,
        full_networks_list: full_networks_list,
    };
};
//# sourceMappingURL=database-context.js.map