// SPDX-License-Identifier: MIT
// wtf.academy
pragma solidity ^0.8.4;

contract slotHank {
    uint256 public count_A = 0x278A8762;  //slot0
    uint256 public count_B = 0x278B8762;
    uint256 private count_C = 0x278C8762;
//slot3
    uint128 private count_128 = 0x128FFFFFFFFFFFFFFFFFFF128; 
    uint64 private count_64 = 0x64FFFFFFFFFFFF64;
    uint32 private count_32 = 0x32FFFF32;
    uint16 public count_16 = 0x1616;
    uint8 public count_8 = 0xAA;
    //slot4
    address public owner = msg.sender;
    bool private isOpen1 =true;
    bool private isOpen2 = true;

    //常量不在储存槽中，而是在编译的时候硬编码到代码里，不占用插槽
    uint public constant fixed_num = 0xc1;

    bytes32 private secret_num;     //slot5
    bytes32[3] private secret_data; //slot6-8
    mapping(uint256 => uint256) public item_1; //slot 9
    address[] private users; //slot 10

    // 变长 
    uint[][] twoArray; //slot11

    constructor() payable {
        set_item1(123456);
        set_users(msg.sender);
    }

    function set_countA(uint256 value) public {
        count_A = value;
    }

    function set_users(address addr) public {
        users.push(addr);
    }

    function set_twoArray() public{
        twoArray.push([100,200,300,400]);
        twoArray.push([500,600,700]);
    }

    function set_item1(uint value) public{
        item_1[count_A] = value;
    }

    function guess_item_2(uint256 gussValue) public view returns(bool){
        require(item_1[count_A] != 0, "the value for item1 errors!");
        if(item_1[count_A] == gussValue){
            return true;
        }else{
            return false;
        }
    }
    
} 