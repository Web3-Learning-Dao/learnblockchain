const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gov", function () {
  it("Gov withdraw", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Comm = await hre.ethers.getContractFactory("Comm");
    const comm = await Comm.deploy();
    await comm.deployed();
    console.log("comm deployed to:", comm.address);
    const Treasury = await hre.ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy({ value: ethers.utils.parseEther("2") });
    await treasury.deployed();
    console.log("treasury deployed to:", treasury.address);
    const Gov = await hre.ethers.getContractFactory("Gov");
    const gov = await Gov.deploy(comm.address,treasury.address,1);
    await gov.deployed();
    console.log("gov deployed to:", gov.address);

    await gov.vote(owner.address,1,true);

    await network.provider.send("evm_increaseTime", [3*24*3600]);

    console.log("before balance:",await owner.getBalance());

    await gov.propose(1);

    console.log("balance:",await owner.getBalance());


  });
});