require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv/config.js");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY,
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },

  gasReporter: {
    currency: "USD",
    gasPrice: 5,
  },

  networks: {
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [process.env.PRIVATE_KEY],
    },
    ganache: {
      url: "http://localhost:8545",
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  // etherscan: {
  //   apiKey: {
  //     bsc: BSCSCAN_API_KEY,
  //   },
  //   // custom_chains: [
  //   //   {
  //   //     network: "bsc",
  //   //     gas: 8000000,
  //   //     gasPrice: 8000000000,
  //   //     chainId: 56,
  //   //     urls: {
  //   //       apiURL: "https://api.bscscan.com/api",
  //   //       browserURL: "https://bscscan.com,",
  //   //     },
  //   //   },
  //   // ],
  // },
};
