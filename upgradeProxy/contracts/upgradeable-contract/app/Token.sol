// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../utils/GameOwner.sol";
/**
 * @title MichaelJordanToken (MJT)
 * @notice
*/
contract BasketballTeamToken is ERC20, GameOwner {
    uint256 private immutable _SUPPLY_CAP;
    address private team;

    /**
     * @notice Constructor
     * @param _cap supply cap (to prevent abusive mint)
     */
    constructor(
        uint256 _cap
    ) ERC20("BasketballTeam Token", "BTT") {
        _SUPPLY_CAP = _cap;
        gameRoles[msg.sender] = true;
    }

    function passTeamRole(address _team) public onlyOwner returns (bool) {
        team = _team;

        return true;
    }

    /**
     * @notice Mint MJT tokens
     * @param account address to receive tokens
     * @param amount amount to mint
     * @return status true if mint is successful, false if not
     */
    function GameMint(address account, uint256 amount) external onlyOwner returns (bool status) {
        if (totalSupply() + amount <= _SUPPLY_CAP) {
            _mint(account, amount);
            return true;
        }
        return false;
    }

    function gameBurn(address account, uint256 amount) public onlyGame returns (bool){
        _burn(account, amount);
        return true;
    }
    function gameTransfer(address from, address to, uint256 amount) public onlyGame returns (bool){
        _transfer(from, to, amount);
        return true;
    }

    function gameApprove(address spender, uint256 amount) public onlyGame returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @notice View supply cap
     */
    function SUPPLY_CAP() external view returns (uint256) {
        return _SUPPLY_CAP;
    }
}