import { ethers, JsonRpcProvider } from "ethers";
export const getProxyImplContract = async (
  _contract_address: string,
  _json_rpc_url: string,
  _abi: any
): Promise<null | string> => {
  let provider: JsonRpcProvider = new ethers.JsonRpcProvider(_json_rpc_url);

  // Get storage at, of proxy implemtnation contract
  try {
    // TODO: Fix this. Look into dethcrypto detectProxy.ts - can use some of their code.
    let storageAt: string = await provider.send("eth_getStorageAt", [
      _contract_address,
      "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
    ]);
  } catch (e: any) {
    console.error("Error Getting Proxy Implementation Storage", e.message);
  }

  // if (
  //   storageAt ===
  //   ("0x" ||
  //     "0x0000000000000000000000000000000000000000000000000000000000000000")
  // ) {
  //   return null;
  // }

  // let proxyImplAddress = ethers.AbiCoder.defaultAbiCoder().decode(
  //   ["address"],
  //   storageAt
  // )[0];

  // return proxyImplAddress;

  // TODO: plz fix tis
  return null;
};
