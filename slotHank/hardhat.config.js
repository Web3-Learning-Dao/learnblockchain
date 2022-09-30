require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: "./hardhat-tutorial/hardhat-tutorial.env" });
require('hardhat-deploy');
const {HardhatUserConfig} = require('hardhat/types');

const RINKEBY_API_KEY_URL = process.env.RINKEBY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

const ROPSTEN_API_KEY_URL = process.env.ROPSTEN_API_KEY_URL;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 const config = {
  solidity: {
    compilers: [
    {
      version:"0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
    {
      version:"0.7.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
  ]
  },
  networks: {
    rinkeby:{
      url: RINKEBY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
    ropsten:{
      url: ROPSTEN_API_KEY_URL,
      accounts: [ROPSTEN_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey:ETHERSCAN_KEY,
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
    play1: 2,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
module.exports = config;
