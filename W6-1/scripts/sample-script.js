const hre = require("hardhat");

async function main() {
  const UsdcToken = await hre.ethers.getContractFactory("UsdcToken");
  const usdcToken = await UsdcToken.deploy();
  await usdcToken.deployed();
  console.log("UsdcToken deployed to:", usdcToken.address);

  const PriceUpToken = await hre.ethers.getContractFactory("PriceUpToken");
  const priceUpToken = await PriceUpToken.deploy(usdcToken.address);
  await priceUpToken.deployed();
  console.log("PriceUpToken deployed to:", priceUpToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });