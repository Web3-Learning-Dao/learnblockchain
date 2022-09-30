import { task } from "hardhat/config";
import("@nomiclabs/hardhat-waffle");
import("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: "./hardhat-tutorial/hardhat-tutorial.env" });

const RINKEBY_API_KEY_URL = process.env.RINKEBY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

const ROPSTEN_API_KEY_URL = process.env.ROPSTEN_API_KEY_URL;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

module.exports = {
  //部署网络
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/<key>" ,//分叉主网，总是进行
        blockNumber: 1095000 //用于锁定区块号，提高测试稳定性和速度
      }
    },
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
  solidity: {
    // 编译版本
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  //编译以后的文件路径
  paths: {
    // 合约来源
    sources: "./contracts",
    // 测试文件
    tests: "./test",
    // 缓存目录
    cache: "./cache",
    // 编译目录
    artifacts: "./artifacts"
  }
};