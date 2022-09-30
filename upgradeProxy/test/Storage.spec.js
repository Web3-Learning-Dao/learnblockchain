const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-ganache");

describe('Storage', accounts => {
    let StorageFactory;
    let Storage;
    beforeEach(async function(){
        StorageFactory = await ethers.getContractFactory("Storage");
        Storage = await StorageFactory.deploy();
        await Storage.deployed();
    });

    it("Should return the new greeting once it's changed", async function () {
        await Storage.store(10);
        expect(await Storage.val()).to.equal(10);
        const setValue = await Storage.setValue(20);
        // wait until the transaction is mined
        await setValue.wait();
        expect(await Storage.val()).to.equal(20);

    });
});

describe('Storage (proxy)', function () {
    let StorageFactory;
    let Storage;
    beforeEach(async function () {
        StorageFactory = await ethers.getContractFactory("Storage");
        Storage = await upgrades.deployProxy(StorageFactory, [42], {initializer: 'store'});
    });
   
    // Test case
    it('retrieve returns a value previously initialized', async function () {
      // Test if the returned value is the same one
      // Note that we need to use strings to compare the 256 bit integers
      expect((await Storage.val()).toString()).to.equal('42');
    });
});

describe('StorageV2', accounts => {
    let StorageV2Factory;
    let StorageV2;
    beforeEach(async function(){
        StorageV2Factory = await ethers.getContractFactory("StorageV2");
        StorageV2 = await StorageV2Factory.deploy();
        await StorageV2.deployed();
    });

    it("Should return the new greeting once it's changed", async function () {
        await StorageV2.store(10);
        expect(await StorageV2.val()).to.equal(10);
        const setValue = await StorageV2.setValue(20);
        // wait until the transaction is mined
        await setValue.wait();
        expect(await StorageV2.val()).to.equal(20);
    });
    
    it('retrieve returns a value previously incremented', async function () {
        // Increment
        await StorageV2.increment();
     
        // Test if the returned value is the same one
        // Note that we need to use strings to compare the 256 bit integers
        expect((await StorageV2.val()).toString()).to.equal('1');
      });
});

describe('StorageV2 (proxy)', function () {
    let StorageFactory , StorageV2Factory ,Storage ,StorageV2;
    beforeEach(async function () {
      StorageFactory = await ethers.getContractFactory("Storage");
      StorageV2Factory = await ethers.getContractFactory("StorageV2");
   
      Storage = await upgrades.deployProxy(StorageFactory, [42], {initializer: 'store'});
      StorageV2 = await upgrades.upgradeProxy(Storage.address, StorageV2Factory);
    });
   
    // Test case
    it('retrieve returns a value previously incremented', async function () {
      // Increment
      await StorageV2.increment();
   
      // Test if the returned value is the same one
      // Note that we need to use strings to compare the 256 bit integers
      expect((await StorageV2.val()).toString()).to.equal('43');
    });
  });