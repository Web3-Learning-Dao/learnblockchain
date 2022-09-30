
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const {play1} = getUnnamedAccounts();
  console.log(play1);

  await deploy('Greeter', {
    from: deployer,
    args: [`hello`],
    log: true,
  });
};

module.exports.tags = ['Greeter'];