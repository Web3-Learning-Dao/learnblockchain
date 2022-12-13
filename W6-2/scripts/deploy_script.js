const hre = require("hardhat");

async function main() {
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });