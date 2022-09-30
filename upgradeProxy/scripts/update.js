const { ethers, upgrades } = require("hardhat");

async function main(){
const LOCK_ADDRESS = `0xe8D2A1E88c91DCd5433208d4152Cc4F399a7e91d`;
const LockV2 = await ethers.getContractFactory("LockV2UUPS");
const lockV2 = await upgrades.upgradeProxy(LOCK_ADDRESS,LockV2);
console.log("Box upgraded");
console.log("Lock V2 deployed to:", lockV2.address);

console.log("Contractis", lockV2.address);
console.log("ContractImplementationAddress is",await upgrades.erc1967.getImplementationAddress(lockV2.address));
console.log("ContractAdminAddress is",await upgrades.erc1967.getAdminAddress(lockV2.address) );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
