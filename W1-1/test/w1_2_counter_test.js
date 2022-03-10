const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(100);
    await counter.deployed();

    const counterTx = await counter.count();

    // wait until the transaction is mined
    await counterTx.wait();

  });
});
