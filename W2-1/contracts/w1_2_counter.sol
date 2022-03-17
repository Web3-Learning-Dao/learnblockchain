//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Counter {
    uint public counter;

    constructor( uint initcount) {
        counter = initcount;
    }

    function count() public  {
      counter++;
      console.log("curr count is [%d]",counter);
    }

    function add(uint x) public {
        counter = counter + x;
    }
}
