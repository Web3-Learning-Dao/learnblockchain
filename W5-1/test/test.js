import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

let owner;
let addr1;
let addr2;
beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
});