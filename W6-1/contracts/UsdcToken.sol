//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdcToken is ERC20 {
    constructor() ERC20("UsdcToken", "USDC") {
         _mint(msg.sender, 2000 * 10**uint256(decimals()));
    }
}