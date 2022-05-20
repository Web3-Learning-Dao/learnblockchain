const { ethers } = require('ethers');
const fs = require('fs');
const { keccak256 } = require("@ethersproject/keccak256");
const contractFile = require('./compile');
const { toUtf8Bytes } =  require("@ethersproject/strings");

require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;
const apiKey = process.env.API_KEY;
let gas_limit = "0x100000"

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
const provider = new ethers.providers.AlchemyProvider("rinkeby", apiKey);

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
/*
   -- Deploy Contract --
*/
// 创建合约工厂
const deployContractIns = new ethers.ContractFactory(abi, bytecode, wallet);

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
    '===============================2.connect signer and provider'
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
  console.log('===============================4. Listen To Events');

  // Listen to event once
  providerContract.once('Transfer', (from, to, value) => {
    console.log(
      `I am a once Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

  // Listen to events continuously
  providerContract.on('Transfer', (from, to, value) => {
    console.log(
      `I am a longstanding Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

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

Trans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });