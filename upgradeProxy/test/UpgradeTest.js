const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  

describe("Upgrade", function () {

    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Lock = await ethers.getContractFactory("Lock");
        const lock = await upgrades.deployProxy(Lock,[unlockTime]);
        await lock.deployed();
        console.log("Lock deployed to:", lock.address);

        return { lock, unlockTime, owner, otherAccount };
      }

    it('Upgrade for proxy', async () => {
        const {lock}  = await loadFixture(deployOneYearLockFixture);

        const lockedAmount = hre.ethers.utils.parseEther("10");
        const tx = await lock.deposit({value:lockedAmount});
        await tx.wait();
        const lockBalance =  await ethers.provider.getBalance(lock.address);
        console.log(`contract value :${lockBalance}`);

        const LockV2 = await ethers.getContractFactory("LockV2");
        const lockv2 = await upgrades.upgradeProxy(lock.address,LockV2);
        
        const lockV2Balance = await ethers.provider.getBalance(lockv2.address);

        expect(lockBalance.toString()).to.equal(lockV2Balance.toString());
        
    });

    it(`deposit for owner and other walle`,async() =>{
        const {lock,owner,otherAccount}  = await loadFixture(deployOneYearLockFixture);
        const lockedAmount = hre.ethers.utils.parseEther("10");
        const tx =  await lock.deposit({value:lockedAmount});
        await tx.wait();
        const lockBalance =  await ethers.provider.getBalance(lock.address);
        console.log(`contract value :${lockBalance}`);

        const tx2 = await lock.connect(otherAccount).deposit({value:lockedAmount});
        await tx2.wait();

        const lockBalance2 =  await ethers.provider.getBalance(lock.address);
        expect(lockBalance2).to.equal(lockBalance.add(lockedAmount));

    });
});