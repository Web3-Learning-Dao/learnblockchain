// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LockV2 is Initializable {
    uint public unlockTime;
    address payable public owner;

    mapping(address=>uint) banlenceEth;
    
    event Withdrawal(uint amount, uint when);
    event Deposit(address indexed user,uint256 amount);
    

    function initialize(uint _unlockTime) public initializer  payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
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



}
