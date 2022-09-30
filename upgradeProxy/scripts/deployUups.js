// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;
  let payableValue  = ethers.utils.parseEther('1.0') ;

  const Lock = await ethers.getContractFactory("LockUUPS");
  const lock = await upgrades.deployProxy(Lock,[unlockTime],{
    initializer: 'initialize',
    kind: 'uups' 
  });
  await lock.deployed();
  console.log("Lock with 1 ETH deployed to:", lock.address);

  const [ownerSigner,play1] = await ethers.getSigners();
  console.log(`deploy owner: ${ownerSigner.address} ,  play1 address:${play1.address}`);
  const tx = await lock.deposit({value:payableValue});
  await tx.wait();
  const value =  await ethers.provider.getBalance(lock.address);
  console.log(`contract value :${value}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x4631BCAbD6dF18D94796344963cB60d44a4136b6