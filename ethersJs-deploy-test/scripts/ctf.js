const { ethers } = require('ethers');
const fs = require('fs');
const { keccak256 } = require("@ethersproject/keccak256");
const contractFile = require('./compile');
const { toUtf8Bytes } =  require("@ethersproject/strings");
const { Console } = require('console');
require('dotenv').config();

const privatekey = process.env.PRIVATE_KEY;
const rinkebyApiKey = process.env.REKEBY_API_KEY;
const mainnetApiKey = process.env.MAINNET_API_KEY;

const providerTest = async () => {
    const RPCPoint = 'http://34.123.187.206:8545/1005bf33-6812-48e1-bcaf-c37b1c9f4b9e';
    //通过指自定义节点RPC链接到主网
    const providerMainnet = new ethers.providers.JsonRpcProvider(RPCPoint);
    //通过alchemy链接到rinkeby测试网络
    const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);
    //1.查询provider链接到了哪条链
    console.log("1. 查询provider链接到了哪条链");
    const networkProvider = await providerMainnet.getNetwork();
    console.log(`networkProvider is `);
    console.log(networkProvider);

    const networkProviderRinkeby = await providerRinkeby.getNetwork();
    console.log("networkProviderRinkeby");
    console.log(networkProviderRinkeby);

    console.log("2.获取测试地址余额");
    const privateKey = "0x4e901daba2d0a130f4f4ac8ea0a02abd0ac03a127fc376afdb19d2156b5ff57d";
    // 创建钱包
    let wallet = new ethers.Wallet(privateKey, providerMainnet);
    console.log(`Attempting to deploy from account: ${wallet.address}`);

    //链接钱包到网络
    let walletSigner = wallet.connect(providerMainnet);
    console.log(`walletSigner balence ${walletSigner.balance}`);

}

providerTest()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
