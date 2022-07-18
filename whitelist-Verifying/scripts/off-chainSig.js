const { ethers } = require('ethers');


let abi = [
    "function verifySignature(uint256 nonce, bytes calldata signature)"
];

let provider = ethers.getDefaultProvider('ropsten');

// Create a wallet to sign the message with
let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
let wallet = new ethers.Wallet(privateKey);

console.log(wallet.address);
// "0x14791697260E4c9A71f18484C9f997B308e59325"

let contractAddress = '0x80F85dA065115F576F1fbe5E14285dA51ea39260';
let contract = new Contract(contractAddress, abi, provider);

let message = ethers.utils.solidityPack(
["address", "uint256"], 
["0xabc", "0"],
'0x169841AA3024cfa570024Eb7Dd6Bf5f774092088',
'0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33',
'0x0a290c8cE7C35c40F4F94070a9Ed592fC85c62B9',
'0x43Be076d3Cd709a38D2f83Cd032297a194196517',
'0xC7FaB03eecA24CcaB940932559C5565a4cE9cFFb',
'0xE4336D25e9Ca0703b574a6fd1b342A4d0327bcfa',
'0xeDcB8a28161f966C5863b8291E80dDFD1eB78491',
'0x77cbd0fa30F83a249da282e9fE90A86d7936FdE7',
'0xc39F9406284CcAeB426D0039a3F6ADe14573BaFe',
'0x16Beb6b55F145E4269279B82c040B7435f1088Ee',
'0x900b2909127Dff529f8b4DB3d83b957E6aE964c2',
'0xeA2A799793cE3D2eC6BcD066563f385F25401e95',
);

message = ethers.utils.solidityKeccak256(["bytes"], [message]);
// Sign the string message
const signature = await wallet.signMessage(ethers.utils.arrayify(message));

// For Solidity, we need the expanded-format of a signature
let sig = ethers.utils.verifySignature(0,flatSig);

// Call the verifyString function
let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);

console.log(recovered);
// "0x14791697260E4c9A71f18484C9f997B308e59325"

