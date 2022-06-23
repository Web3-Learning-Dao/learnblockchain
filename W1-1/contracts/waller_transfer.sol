// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract ERC20Basic is IERC20 {

    string public constant name = "ERC20Basic";
    string public constant symbol = "ERC";
    uint8 public constant decimals = 18;


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_ = 10 ether;


   constructor() {
    balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns (uint256) {
    return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender]-numTokens;
        balances[receiver] = balances[receiver]+numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner]-numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender]-numTokens;
        balances[buyer] = balances[buyer]+numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}


contract DEX {

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    address public token;
   // address public toAddress = 0xcf3285e093cd93015e7456911e2db34AB4975bAd;

    constructor(address tokenAddress) {
        token = tokenAddress; //0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    }

    function setTokenAddress(address tokenAddress) public {
        token = tokenAddress;
    }

    function approveToken(address _to,uint256 amount) public {
        IERC20(token).approve(_to, amount);
    }
    
    function getAllowance(address _to) public view returns (uint256){
        uint256 allowance = IERC20(token).allowance(msg.sender,_to);
        return allowance;
    }

    function buy(address toAddress ,uint256 amount) payable public {
        uint256 dexBalance = IERC20(token).balanceOf(msg.sender);
        require(amount > 0, "You need to send some ether");
        require(amount <= dexBalance, "Not enough tokens in the reserve");
        IERC20(token).transferFrom(msg.sender, toAddress, amount);
    }

    // function transferETH(address toAddress ,uint256 amount) payable public{
    //     address payable sendETHAddress =  payable(msg.sender);
    //  //   sendETHAddress.transfer(toAddress, amount);
    // }

    function getBalanceNum() public view returns (uint256){
         uint256 dexBalance = IERC20(token).balanceOf(msg.sender);
         return dexBalance;
    }

    function getETHBalance() public view returns (uint256){
         uint256 dexBalance = address(msg.sender).balance;
         return dexBalance;
    }

    function sell(address toAddress,uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = IERC20(token).allowance(msg.sender, (toAddress));
        require(allowance >= amount, "Check the token allowance");
        IERC20(token).transferFrom(msg.sender, (toAddress), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

   function receiver() public payable{}


}
