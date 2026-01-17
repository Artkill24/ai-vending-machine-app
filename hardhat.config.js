require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arcTestnet: {
      url: "https://rpc.testnet.arc.network", // CORRETTO!
      chainId: 5042002, // CORRETTO!
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
    }
  }
};
