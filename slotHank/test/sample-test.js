const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts} = require('hardhat');

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();
    await deployments.fixture(["Greeter"]);
    const greeter = await ethers.getContract("Greeter");

    const [owner,play1,play2] = await ethers.getSigners();
    console.log(owner.address);
    console.log(play1.address);
  
    const { deployer } = await getNamedAccounts();
    const accounts = await getUnnamedAccounts();
  
    console.log(deployer);
    console.log(accounts);


    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");

  });
});
