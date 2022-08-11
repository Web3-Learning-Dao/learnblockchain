const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PriceUpToken", function () {
  it("price up option token", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const UsdcToken = await hre.ethers.getContractFactory("UsdcToken");
    const usdcToken = await UsdcToken.deploy();
    await usdcToken.deployed();
    console.log("UsdcToken deployed to:", usdcToken.address);

    const PriceUpToken = await hre.ethers.getContractFactory("PriceUpToken");
    const priceUpToken = await PriceUpToken.deploy(usdcToken.address);
    await priceUpToken.deployed();
    console.log("PriceUpToken deployed to:", priceUpToken.address);


    await priceUpToken.mint({value:20});

    await priceUpToken.transfer(addr1.address,10);

    console.log(await priceUpToken.balanceOf(addr1.address));

    await network.provider.send("evm_increaseTime", [100*24*3600]);

    await usdcToken.approve(priceUpToken.address, ethers.constants.MaxUint256); 
    await priceUpToken.settlement(10);

    await network.provider.send("evm_increaseTime", [24*3600]);
    await priceUpToken.burnAll();
    
  });
});