import axios from "axios";
import { getProxyImplContract } from "./fetch-proxy-impl";

const getAbi = async (
  address: string,
  block_explorer: string | null,
  json_rpc: string | null
): Promise<any> => {
  // @Typeguard
  if (block_explorer == null) return null;
  if (json_rpc == null) return null;

  // Initialize abi
  let abi: any = null;

  // API Endpoint
  const apiBase = `https://api.${block_explorer.split("https://")[1]}`;

  console.log("API BAse", apiBase);

  // URL to fetch ABI From
  const url = `${apiBase}/api?module=contract&action=getabi&address=${address}`;

  console.log("Fetching Abi From URL:", url);

  // Fetch ABI
  const { data } = await axios.get(url);

  console.log("INitial Data Frm ULR", data);

  /**
   * @notice
   * Check the eip 1967 storage slot for the proxy implementation contract address,
   * if we find one, we fetch the ABI from that contract.
   * if not, we continue with the ABI we already have.
   */

  // Proxy Address
  let proxyImplAddress = null;
  // ;await getProxyImplContract(
  //   address,
  //   json_rpc,
  //   data.result
  // );

  // If proxy address exists, fetch ABI from that contract
  if (proxyImplAddress !== null) {
    console.log("Proxy Implentation Address", proxyImplAddress);
    const url = `${apiBase}/api?module=contract&action=getabi&address=${proxyImplAddress}`;
    let data;
    try {
      ({ data } = await axios.get(url));
    } catch (e: any) {
      console.log("Failed Axios Try Catch");
      await new Promise((resolve: any) => setTimeout(resolve, 3000));
      ({ data } = await axios.get(url));
    }
    abi = data.result;
  } else abi = data.result;

  // Return ABI (Or null if not found)
  if (!abi) return null;
  return JSON.parse(abi);
};

export { getAbi };
