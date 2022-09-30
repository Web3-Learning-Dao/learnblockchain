const { ethers, Wallet } = require('ethers');
const fs = require('fs');
const { keccak256 } = require("@ethersproject/keccak256");
const contractFile = require('./compile');
const { toUtf8Bytes } =  require("@ethersproject/strings");
const { Console } = require('console');
const { LogDescription } = require('ethers/lib/utils');
require('dotenv').config();

const privatekey = process.env.PRIVATE_KEY;
const rinkebyApiKey = process.env.REKEBY_API_KEY;
const mainnetApiKey = process.env.MAINNET_API_KEY;

let gas_limit = "0x100000";

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
  development: {
    name: 'moonbeam-development',
    rpc: 'http://localhost:8545',
    chainId: 1281,
  },
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.testnet.moonbeam.network',
    chainId: 1287,
  },
};

//链接到rinkeby测试网络
const provider = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);

// const provider = new ethers.providers.InfuraProvider(
//   'kovan',
//   process.env.INFURA_ID
// ); //Change to correct network

// Variables
const account_from = {
  privateKey: privatekey,
};

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 创建钱包
let wallet = new ethers.Wallet(account_from.privateKey, provider);
console.log(`Attempting to deploy from account: ${wallet.address}`);

//链接钱包到网络
let walletSigner = wallet.connect(provider)

//查询账号ETH 余额
async function query_ETH_balance(account) 
{
    let balance=await provider.getBalance(account)
    var etherString = ethers.utils.formatEther(balance);
    console.log("Balance: " + etherString);    
}

function send_token(
    contract_address,
    send_token_amount,
    to_address,
    send_account
  ) {

    provider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
      console.log(`gas_price: ${gas_price}`)
  
      if (contract_address) {
        // general token send
        let contract = new ethers.Contract(
          contract_address,
          send_abi,
          walletSigner
        )
  
        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        // Send tokens
        contract.transfer(to_address, numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
          alert("sent token")
        })
      } // ether send
      else {
        const tx = {
          from: send_account,
          to: to_address,
          value: ethers.utils.parseEther(send_token_amount),
          nonce: provider.getTransactionCount(
            send_account,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(gas_limit), // 100000
          gasPrice: gas_price,
        }
        console.dir(tx)
        try {
          walletSigner.sendTransaction(tx).then((transaction) => {
            console.dir(transaction)
            alert("Send finished!")
          })
        } catch (error) {
          alert("failed to send!!")
        }
      }
    })
}

const Trans = async () => {
  console.log('===============================1. Deploy Contract');
  /*
    -- Deploy Contract --
  */
  // 创建合约工厂
  const deployContractIns = new ethers.ContractFactory(abi, bytecode, wallet);

  // Send Tx (Initial Value set to 5) and Wait for Receipt
  const deployedContract = await deployContractIns.deploy(
    'hello'
  );
  await deployedContract.deployed();

  console.log(`Contract deployed at address: ${deployedContract.address}`);

  /*
   -- Send Function --
   */
  console.log();
  console.log(
    '===============================2.connect contract for signer and provider'
  );
  const transactionContract = new ethers.Contract(
    deployedContract.address,
    abi,
    provider
  );

// 使用签名器创建一个新的合约实例，它允许使用可更新状态的方法
let contractWithSigner = transactionContract.connect(wallet);

console.log(); 
console.log(
    '===============================3.call contract greet'
  );
   // Call Contract
  const greetReceipt = await transactionContract.greet();
  console.log(greetReceipt);
  
  let setGreetingReceipt = await contractWithSigner.setGreeting("hello world!!");
  console.log(setGreetingReceipt.hash);
  setGreetingReceipt.wait();

  const newGreetReceipt = await transactionContract.greet();
  console.log(newGreetReceipt);
  
  console.log();
  console.log(
    '===============================4. transfer eth'
  );

  let to_address="0xe413B006aCC32C4696e067f1CEB4f121e8F2aE3b"
  await query_ETH_balance(to_address);
  await send_token(null,"1",to_address,wallet.address);
  await query_ETH_balance(to_address);

  /*
   -- Listen to Events --
   */
  console.log();
  console.log('===============================5. Listen ETH To Events');

  // Listen to event once
  provider.once('Transfer', (from, to, value) => {
    console.log(
      `I am a once Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

  // Listen to events continuously
  provider.on('Transfer', (from, to, value) => {
    console.log(
      `I am a longstanding Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });
};

//   // Listen to events with filter
//   let topic = ethers.utils.id('Transfer(address,address,uint256)');
//   let filter = {
//     address: deployedContract.address,
//     topics: [topic],
//     fromBlock: await provider.getBlockNumber(),
//   };

//   providerContract.on(filter, (from, to, value) => {
//     console.log(
//       `I am a filter Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
//     );
//   });

//   for (let step = 0; step < 3; step++) {
//     let transferTransaction = await transactionContract.transfer(
//       '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
//       10
//     );
//     await transferTransaction.wait();

//     if (step == 2) {
//       console.log('Going to remove all Listeners');
//       providerContract.removeAllListeners();
//     }
//   }
// };

const providerTest = async () => {

const RPCUrlMainnet = 'https://eth-mainnet.g.alchemy.com/v2/';
//通过alchemy链接到rinkeby测试网络
const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);

//通过指自定义节点RPC链接到主网
const providerMainnet = new ethers.providers.JsonRpcProvider(`${RPCUrlMainnet}${mainnetApiKey}`);

//1.获取V神eth余额
console.log("1. 查询vitalik在主网和Rinkeby测试网的ETH余额");
const virtalikETHMainnet = await providerMainnet.getBalance('vitalik.eth');
const virtalikETHRinkeby = await providerRinkeby.getBalance('vitalik.eth');

console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(virtalikETHMainnet)} ETH`);
// 输出Rinkeby测试网ETH余额
console.log(`Rinkeby ETH Balance of vitalik: ${ethers.utils.formatEther(virtalikETHRinkeby)} ETH`);

//2.查询provider链接到了哪条链
console.log("2. 查询provider链接到了哪条链");
const networkProvider = await providerMainnet.getNetwork();
console.log(`networkProvider is `);
console.log(networkProvider);

//3.查询区块高度
console.log("3. 查询区块高度");
const blockNum = await providerMainnet.getBlockNumber();
console.log(`blockNumber is ${blockNum}`);

// 4. 查询当前gas price
console.log('4. 查询当前gas price');
const gasPrice = await providerMainnet.getGasPrice();
console.log(`gas price is ${gasPrice}`);

// 5. 查询当前建议的gas设置
console.log(`5. 查询当前建议的gas设置`);
const feeData  = await providerMainnet.getFeeData();
console.log(`fee data is ${feeData}`);

// 6. 查询区块信息
console.log(`6. 查询区块信息`);
const blockData = await providerMainnet.getBlock(blockNum);
console.log(blockData);

// 7. 给定合约地址查询合约bytecode，例子用的WETH地址
const wethAddress = `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`;
const code = await providerMainnet.getCode(wethAddress);
console.log(code);

}

const  contractTest = async() => {

  const RPCUrlMainnet = 'https://eth-mainnet.g.alchemy.com/v2/';

  //通过指自定义节点RPC链接到rinkeby测试网
  //const providerMainnet= new ethers.providers.JsonRpcProvider(`${RPCUrlMainnet}${mainnetApiKey}`);
  const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);


  const addressWETHMainnet = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH Contract
  // WETH合约地址（Rinkeby测试网）
  const addressWETHRinkeby = '0xc778417e063141139fce010982780140aa0cd5ab' // WETH Contract

  const abi = JSON.parse(fs.readFileSync("/mnt/d/buildSpeace/learnblockchain/homeWork/learnblockchain/ethersJs-deploy-test/scripts/wethAbi.json"));
  const code = await providerRinkeby.getCode(addressWETHRinkeby);

  const contractWETH =  new ethers.Contract(addressWETHRinkeby ,abi , providerRinkeby);
  //1. 读取WETH合约的链上信息（WETH abi）
  const nameWETH = await contractWETH.name()
  const symbolWETH = await contractWETH.symbol()
  const totalSupplyWETH = await contractWETH.totalSupply()
  console.log("\n1. 读取WETH合约信息")
  console.log(`合约地址: ${addressWETHRinkeby}`)
  console.log(`名称: ${nameWETH}`)
  console.log(`代号: ${symbolWETH}`)
  console.log(`总供给: ${ethers.utils.formatEther(totalSupplyWETH)}`)
  const balanceWETH = await contractWETH.balanceOf('vitalik.eth')
  console.log(`Vitalik持仓: ${ethers.utils.formatEther(balanceWETH)}\n`)
  
  const wallet = new ethers.Wallet(privatekey,providerRinkeby);
  console.log(wallet);

 // const walletSigner = wallet.signer();
  const contractWithSigner =  contractWETH.connect(wallet);
  //读取账户WETH余额，
  console.log(`waller address is ${wallet.address}`);
  console.log(`waller weth balance is ${ethers.utils.formatEther(await contractWithSigner.balanceOf(wallet.address))}`);
  //调用WETH合约的deposit()函数，将0.001 ETH转换为0.001 WETH，打印交易详情和余额
  const tx = await contractWithSigner.deposit({value: ethers.utils.parseEther("0.001")});
  console.log(tx);
  await tx.wait();
  console.log(`waller weth balance is ${ethers.utils.formatEther(await contractWithSigner.balanceOf(wallet.address))}`);
  //发送WETH给别的地址
  const otherAddress =  `0xcf3285e093cd93015e7456911e2db34AB4975bAd`;
  console.log(`other waller weth balance is ${ethers.utils.formatEther(await contractWithSigner.balanceOf(otherAddress))}`);
  const tx2 = await contractWithSigner.transfer(otherAddress,ethers.utils.parseEther("0.001"));
  await tx2.wait();
  console.log(`other waller weth balance is ${ethers.utils.formatEther(await contractWithSigner.balanceOf(otherAddress))}`);

  const blockNumber =  providerRinkeby.getBlockNumber();
  let eventFilter = contractWithSigner.filters.Transfer(null,otherAddress,null);
  let events = await contractWithSigner.queryFilter(eventFilter,-100, "latest");
  console.log(events);
} 

const eventListen = async() =>{
  try{
    
    //通过指自定义节点RPC链接到rinkeby测试网
    //const providerMainnet= new ethers.providers.JsonRpcProvider(`${RPCUrlMainnet}${mainnetApiKey}`);
    const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);
    // WETH合约地址（Rinkeby测试网）
    const addressWETHRinkeby = '0xc778417e063141139fce010982780140aa0cd5ab' // WETH Contract
    const abi = JSON.parse(fs.readFileSync("/mnt/d/buildSpeace/learnblockchain/homeWork/learnblockchain/ethersJs-deploy-test/scripts/wethAbi.json"));
    const contractWETH =  new ethers.Contract(addressWETHRinkeby ,abi , providerRinkeby);
    contractWETH.on("Deposit",(dst,wad)=>{
      console.log(`from:${dst},value:${ethers.BigNumber.from(wad).toString()}`);
    });

  }catch(error){
    console.log(error);
  }
}

const walletTest = async() =>{

  const RPCUrlMainnet = 'https://eth-mainnet.g.alchemy.com/v2/';
  //通过指自定义节点RPC链接到主网
  const providerMainnet = new ethers.providers.JsonRpcProvider(`${RPCUrlMainnet}${mainnetApiKey}`);

  //链接到rinkeby测试网络
  const providerRinkeby = new ethers.providers.AlchemyProvider("rinkeby", rinkebyApiKey);

  const walletRandom = new ethers.Wallet.createRandom();
  const walletRandomProvider = walletRandom.connect(providerRinkeby);
  const mnemonic_walletRandom =  walletRandom.mnemonic;
  console.log(mnemonic_walletRandom);
  //console.log(`mnemonic walletRandom : ${mnemonic_walletRandom}`);

  //使用私钥创建的钱包 不能获取记助词
  const walletPrivateKey = new ethers.Wallet(privatekey,providerRinkeby);

  // 从助记词创建wallet对象
  const walletMnemonic = new ethers.Wallet.fromMnemonic(mnemonic_walletRandom.phrase);
  console.log(`mnemonic_walletPrivateKey address: ${walletRandom.address} , walletMnemonic address: ${walletMnemonic.address}`);

  console.log(walletRandomProvider);
  console.log("================================");
  console.log(walletRandom);

  //获取钱包交易次数
  console.log(`walletPrivateKey privatekey: ${walletPrivateKey.privateKey}`);
  const getTransactionCount1 = await walletRandomProvider.getTransactionCount();
  const getTransactionCount2 = await walletPrivateKey.getTransactionCount();
  console.log(`walletRandom transaction count: ${getTransactionCount1} , walletPrivateKey tranction count: ${getTransactionCount2} `);

  //发送ETH交易
  console.log(`\n 发送ETH（测试网）`);
  console.log(`i. 发送前余额`);
  console.log(`钱包1: ${ethers.utils.formatEther(await walletPrivateKey.getBalance())} ETH`);
  console.log(`钱包2: ${ethers.utils.formatEther(await walletRandomProvider.getBalance())} ETH`);
  //构造TX
  // const tx = {
  //   to: walletRandom.address,
  //   value: ethers.utils.parseEther(`0.001`)
  // }

  // const receipt = await walletPrivateKey.sendTransaction(tx);
  // await receipt.wait();

  // console.log(`钱包1 : ${ethers.utils.formatEther(await walletPrivateKey.getBalance())} ETH`);
  // console.log(`钱包2: ${ethers.utils.formatEther(await walletRandomProvider.getBalance())} ETH`);
  const signerwithWalletRandom = await ethers.getSigner(walletRandom);
  console.log(`signerwithWalletRandom is ${signerwithWalletRandom}`);

}


providerTest()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

// Trans()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });