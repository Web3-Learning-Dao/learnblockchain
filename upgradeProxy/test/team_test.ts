import { contractsReady,setup } from './testHelpers';
import { expect, use } from './chai-setup';

describe("Farm contract", function () {
  let contract: any;
  beforeEach(async function () {
    contract = await contractsReady();
    
  });

 
  afterEach(async ()=>{
    console.log('===after 1= >',contract)
    console.log('===after 2= >',await contract())
  })  

  it("deploys with total supply zero", async function () {
    const { BasketballTeam } = await setup();
     expect(await BasketballTeam.totalSupply()).equal("0");
  });

  it("does not pass the game role", async () => {

    const { BasketballTeam, users, tokenOwner } = await setup();

    const result = await BasketballTeam.addGameRole(users[0].address);
  });

  it("passes the game role", async () => {
    const { BasketballTeam, users, tokenOwner } = await setup();

    // // Try mint without the game role
    await BasketballTeam.mint(users[0].address);
    expect(await BasketballTeam.totalSupply()).equal("1");

    // Give them the game role
    await BasketballTeam.addGameRole(users[1].address);

    // Try mint without the game role
    const result = await BasketballTeam.connect(users[1].address).mint(users[0].address);
    expect(await BasketballTeam.connect(users[1].address).totalSupply()).equal("2");

    // // Take away the game role
    await BasketballTeam.removeGameRole(users[1].address);

  });

  it("mints a farm", async () => {
    const { BasketballTeam, users, tokenOwner } = await setup();

    await BasketballTeam.mint(users[0].address);

    const newTeam = await BasketballTeam.getTeam(1);

    expect(await BasketballTeam.balanceOf(users[0].address)).equal("1");
    expect(await BasketballTeam.totalSupply()).equal("1");

    expect(newTeam[1]).equal(tokenOwner.address);
    expect(newTeam[2]).equal("1");
  });


});

