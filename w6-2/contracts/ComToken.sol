//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Comm is ERC20 {
    constructor() ERC20("Comm Token", "COM") {
        _mint(msg.sender, 200 * 10**uint256(decimals()));
    }
}