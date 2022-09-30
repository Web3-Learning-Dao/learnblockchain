const {ethers} = require("ethers");
const {abi} = require("../artifacts/contracts/EIP712Mail.sol/EIP712Mail.json");
const { expect } = require("chai");

// 将合约部署在 hardhat node 本地链上
const provider = new ethers.providers.JsonRpcProvider();

// 这里我们使用 hardhat node 自带的地址进行签名
const privateKey = `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
const wallet = new ethers.Wallet(privateKey, provider);

async function sign() {
    // 获取 chainId
    const { chainId } = await provider.getNetwork();
    console.log("====> chainId : ",chainId);
    // 构造 domain 结构体
    // 最后一个地址字段，由于我们在合约中使用了 address(this)
    // 因此需要在部署合约之后，将合约地址粘贴到这里
    const domain = {
        name: 'EIP712Mail',
        version: '1',
        chainId: 4,
        verifyingContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    };
    // The named list of all type definitions
    // 构造签名结构体类型对象
    const types = {
        Mail: [
            {name: 'from', type: 'address'},
            {name: 'to', type: 'address'},
            {name: 'nonce', type: 'uint256'},
            {name: 'expiry', type: 'uint256'},
            {name: 'allowed', type: 'bool'},
            {name: 'contents', type: 'string'}
        ]
    };
    // The data to sign
    // 自行构造一个结构体的值
    const value = {
        from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        nonce: 0,
        expiry: 2208963661,
        allowed: true,
        contents: 'xyyme'
    };
    const signature = await wallet._signTypedData(
        domain,
        types,
        value
    );

    // 将签名分割成 v r s 的格式
    let signParts = ethers.utils.splitSignature(signature);
    console.log(">>> Signature:", signParts);
    // 打印签名本身
    console.log(signature);

    console.log('===============================1. Deploy Contract');
    
    // 创建合约工厂
    //const deployContractIns = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployContractIns = await hre.ethers.getContractFactory("EIP712Mail");
    // Send Tx (Initial Value set to 5) and Wait for Receipt
    const deployedContract = await deployContractIns.deploy(
        chainId,
    );
    await deployedContract.deployed();

    console.log(`Contract deployed at address: ${deployedContract.address}`);

   // const signer = provider.getSigner();
    // const contractABI = abi.abi;
  //  const E712Contract = new ethers.Contract(deployedContract.address, contractABI, signer);
    const PermitTypeHash = await deployedContract.getPermitTypeHash();
    console.log("PermitTypeHash=",PermitTypeHash);
     expect(await deployedContract.permint(signature)).to.equal(true);
    expect(await deployedContract.verify(signature ,wallet.address,value.to,100,1,signParts.v, signParts.r, signParts.s)).to.equal(true);
    
}

sign()
