const hre = require("hardhat");
const {ethers} = require('ethers');
const { solidity } = require("../hardhat.config");
const keccak256 = require('keccak256');
require("dotenv").config({ path: "./hardhat-tutorial/hardhat-tutorial.env" });

const RINKEBY_API_KEY_URL = process.env.RINKEBY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const contractAddress = `0xdAc8E960383bEbc689109FBF95b10a2650eA61F8`;

function addrAdd(_from, _num){
  let b = ethers.BigNumber.from(_from).add(_num);
  return ethers.utils.hexValue(b);
}

async function main() {

  
// const amount1 = ethers.utils.hexZeroPad(ethers.BigNumber.from(0x278A8762).toHexString(), 32);
// const amount2 = ethers.utils.hexZeroPad(ethers.BigNumber.from(10).toHexString(), 32);

// const amount1 = ethers.utils.hexZeroPad(0x278A8762, 32);
// const amount2 = ethers.utils.hexZeroPad(10, 32);
const providerRinkeby =  new ethers.providers.JsonRpcProvider(RINKEBY_API_KEY_URL);

//使用私钥创建的钱包 不能获取记助词
const walletPrivateKey = new ethers.Wallet(RINKEBY_PRIVATE_KEY,providerRinkeby);

console.log(walletPrivateKey.address);

// const soltHex ="0x2cb73cd019c70b24b7128c3a8fa046c2e524595f0f21ef557221be7ab820bc99";// await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["uint", "uint"], [0x278A8762,10]))

// 此时的slot10中保存的是动态数组users的长度。获得动态数组在区块链上的slot的方式。
console.log("\\n动态数组users的长度:%s\\n",await providerRinkeby.getStorageAt(contractAddress, 10));
var hash = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["uint"], [10]));
console.log("\\nuser[0].id:%s\\n", await providerRinkeby.getStorageAt(contractAddress, hash));
console.log("\\nuser[1].id:%s\\n", await providerRinkeby.getStorageAt(contractAddress, addrAdd(hash,1)));

var hash2 = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["uint", "uint"], [0x278A8762,9]));
console.log("\\mapping[0].id:%s\\n", await providerRinkeby.getStorageAt(contractAddress, hash2));

//二维数组第一级数组长度
console.log("\\n二维数组twoArray[]的长度:%s\\n",await providerRinkeby.getStorageAt(contractAddress, 11));
var hash3 =  await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["uint"],[11]));
//二维数组第二级数组长度
const ArraySlot = await providerRinkeby.getStorageAt(contractAddress, hash3);
console.log("\\n二维数组twoArray[][]的长度:%s\\n",ArraySlot);
var hash4 = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["uint"],[hash3]));
for (var i=0;i<ArraySlot;i++)
{ 
  console.log(`\\twoArray[${i}] :${await providerRinkeby.getStorageAt(contractAddress, addrAdd(hash4,i))}\\n`);    
}



//计算mapping 插槽地址 keccak256(bytes32(index) + bytes32(mappingslot))) 
//const soltHex = keccak256(amount1 + amount2);
// console.log(soltHex);

// const soltData = await provider.getStorageAt(contractAddress,soltHex);
// console.log(soltData);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
