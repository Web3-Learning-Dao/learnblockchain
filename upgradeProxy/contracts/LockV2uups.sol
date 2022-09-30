// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract LockV2UUPS is Initializable,UUPSUpgradeable,OwnableUpgradeable{
    uint public unlockTime;

    mapping(address=>uint) banlenceEth;
    event Withdrawal(uint amount, uint when);
    event Deposit(address indexed user,uint256 amount);
    

    function initialize(uint _unlockTime) public initializer  payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
    }

    function withdraw() public onlyOwner {
        // Uncomment this line to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");

        emit Withdrawal(address(this).balance, block.timestamp);

        payable(owner()).transfer(address(this).balance);
    }

    function deposit() public payable {
        banlenceEth[msg.sender] = msg.value;
        emit Deposit(msg.sender,msg.value);
    }

    function setUnlockTime (uint time) public returns(bool){
        unlockTime = time;
        return true;
    }
    
    function getUnlockTime() public view returns(uint){
        return unlockTime;
    }

    function  getUserBalance(address addr) public view returns(uint256 balance){
        balance =  banlenceEth[addr];
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

}
