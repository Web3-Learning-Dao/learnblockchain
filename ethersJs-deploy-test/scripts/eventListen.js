
const { ethers, Wallet } = require('ethers');
const eth = require('ethers');
const fs = require('fs');
const { keccak256 } = require("@ethersproject/keccak256");
const contractFile = require('./compile');
const { toUtf8Bytes } =  require("@ethersproject/strings");
const { Console } = require('console');
require('dotenv').config();


const privatekey = process.env.PRIVATE_KEY;
const rinkebyApiKey = process.env.REKEBY_API_KEY;
const mainnetApiKey = process.env.MAINNET_API_KEY;
const jsonAbi = require(`./wethAbi.json`);

let gas_limit = "0x100000";

const eventListen = async() =>{
    try{
      //通过指自定义节点RPC链接到rinkeby测试网
      //const providerMainnet= new ethers.providers.JsonRpcProvider(`${RPCUrlMainnet}${mainnetApiKey}`);
      const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);
      // WETH合约地址（Rinkeby测试网）
      const addressWETHRinkeby = '0xc778417e063141139fce010982780140aa0cd5ab' // WETH Contract
      const abi = JSON.parse(fs.readFileSync("/mnt/d/buildSpeace/learnblockchain/homeWork/learnblockchain/ethersJs-deploy-test/scripts/wethAbi.json"));
      console.log(eth);
      const contractWETH =  new ethers.Contract(addressWETHRinkeby ,abi , providerRinkeby);
    //   contractWETH.on("Deposit",(dst,wad)=>{
    //     console.log(`Deposit from:${dst},value:${ethers.BigNumber.from(wad).toString()}`);
    //   });

    //  //正常监听transfer事件
    //   contractWETH.on("Transfer",(from, to, value)=>{
    //     console.log(` Transfer from:${from}, to: ${to},value:${ethers.BigNumber.from(value).toString()}`);
    //   });

    //   //创建过滤器，监听transfer form
    //   const otherAddress =  `0xcf3285e093cd93015e7456911e2db34AB4975bAd`;
       const ownerAddress =  `0x9CF515b5472EBce6Dee1084a4C5947E1735EeD1C`;
    //   let filters =  contractWETH.filters.Transfer(null,[otherAddress,ownerAddress],null);
    //   contractWETH.on(filters,(from, to, value)=>{
    //     console.log(`filters Transfer from:${from}, to: ${to},value:${ethers.BigNumber.from(value).toString()}`);
    //   });
      
      //事件主题过滤 3个indexed 存在4个topic 第一个事件主题是默认主题为事件签名，然后每个indexed有一个主题
      //搜索所有事件
      let eventFilter = contractWETH.filters.Transfer();
      let events = await contractWETH.queryFilter(eventFilter);
      console.log(events);

    }catch(error){
      console.log(error);
    }
  }
  
  eventListen();