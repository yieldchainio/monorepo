import { ethers } from "ethers";
/*---------------------------------------------------------------
    // @Encoding encodes input using ethers, attempts to search through the abi for the function (And gets it if it exists instead of using the hardcoded var name)
----------------------------------------------------------------*/
export const encoding = async (_provider, _contractAddress, _arg, _type, _abi) => {
    try {
        // TODO: Make currentChainId in LifiSwap a cusotm argument rather than a hardcoded variable. too inefficient that way, can & should be
        // TODO: determined on the FE within the releveant component.
        let contract = new ethers.Contract(_contractAddress, _abi, _provider);
        let isFunction = _abi.find((func) => func.name == _arg && func.outputs && func.outputs.length > 0)
            ? true
            : false;
        let encoded;
        if (isFunction) {
            // If we can find a read function in the provided ABI named like the argument, we read it instead of using the hardcoded string literally
            encoded = ethers.AbiCoder.defaultAbiCoder().encode([_type], [await contract[_arg]()]);
        }
        else {
            // Else, we just use the arg
            if (_arg == "currentChainId")
                _arg = 56; // TODO: Remove this crap on the LiFi Classification
            encoded = ethers.AbiCoder.defaultAbiCoder().encode([_type], [_arg]);
        }
        return encoded;
    }
    catch (e) {
        console.log("Failed to encode arg:", _arg, "of type:", _type);
        console.log("Error Message:", e);
        throw "Failed to encode arg";
    }
};
//# sourceMappingURL=Encoding.js.map