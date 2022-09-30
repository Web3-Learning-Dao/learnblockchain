// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [admin, user] = await hre.ethers.getSigners();
  //console.log(`admin : ${admin.address},user :${user.address}`);
  console.log(admin);
  console.log(user);
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.attach(`0x4fEBf5aBD13BC1b4eD565957C167388521eFd7Ed`);
  //const greeter = await Greeter.deploy("Hello, Hardhat!");

  //await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
  const greetData = await greeter.connect(admin.address).greet();
  console.log("greetData==>",greetData);
  const ownerAddress = await greeter.owner();
  console.log("owner==>",ownerAddress);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
