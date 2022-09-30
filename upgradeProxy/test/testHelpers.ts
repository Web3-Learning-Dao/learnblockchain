import { setupUser, setupUsers } from './setUser';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';

export async function contractsReady() {
    return deployments.createFixture(async ({ deployments, ethers }, options) => {
        await deployments.fixture();

        const BasketballTeamEntrance = await ethers.getContract('BasketballTeam');
        const BasketballTeamTokenEntrance = await ethers.getContract('BasketballTeamToken');

        const deps = {
            BasketballTeam: BasketballTeamEntrance,
            BasketballTeamToken: BasketballTeamTokenEntrance,
        };

        // if (context && typeof context === 'object') {
        //     Object.keys(deps).forEach((key) => (xx[key] = deps[key]));
        // }
        return deps;
    });
}

export async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["BasketballTeam", "BasketballTeamToken"]);
    // await deployments.fixture(["BasketballTeamToken"]);
  
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
      BasketballTeamToken: (await ethers.getContract('BasketballTeamToken')),
      BasketballTeam: (await ethers.getContract('BasketballTeam')),
    };
  
    // we get the tokenOwner
    const { tokenOwner } = await getNamedAccounts();
    // get fet unnammedAccounts (which are basically all accounts not named in the config, useful for tests as you can be sure they do not have been given token for example)
    // we then use the utilities function to generate user object/
    // These object allow you to write things like `users[0].Token.transfer(....)`
    const users = await setupUsers(await getUnnamedAccounts(), contracts);
    // finally we return the whole object (including the tokenOwner setup as a User object)
    return {
      ...contracts,
      users,
      tokenOwner: await setupUser(tokenOwner, contracts),
    };
  }


