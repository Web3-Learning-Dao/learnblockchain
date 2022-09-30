// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract EIP712Mail is ERC20{
    // ERC20 信息，name 和 version 用于 domain 签名
    string  public constant TokenName     = "Dai Stablecoin";
    string  public constant TokenSymbol   = "DAI";
    string  public constant version  = "1";

    // Mail 是待签名的结构体
    struct Permit {
        address holder;
        address spender;
        uint256 nonce;
        uint256 expiry;
        bool allowed;
        string contents;
    }

    //域结构体
    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }


    // nonces 用于避免重放攻击
    mapping (address => uint) public nonces;

// --- EIP712 niceties ---

    // 计算签名结构体 Permit 的哈希
    // bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address from,address to,uint256 nonce,uint256 expiry,bool allowed,string contents)");

    bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed,string contents)");

    bytes32 public immutable DOMAIN_SEPARATOR;

     constructor(uint256 chainId_) ERC20(TokenName, TokenSymbol)  {

        // 计算 domain 哈希
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes(TokenName)),
            keccak256(bytes(version)),
            chainId_,
            address(this)
        ));

        console.log("constructor end [%s] ...[%s]!!",msg.sender,address(this));
    }

    // 常规授权方法
    function approve(address spender, uint amount) public virtual override  returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    // 计算待签名的结构体的哈希
    function hashStruct(Permit memory permitData) public view returns (bytes32) {
        return  keccak256(abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH,
                                     permitData.holder,
                                     permitData.spender,
                                     permitData.nonce,
                                     permitData.expiry,
                                     permitData.allowed,
                                     permitData.contents))
        ));
    }

    // --- Approve by signature ---
    // 重点是这里的 permit 函数
    //验证签名
    function verify(bytes32 digest,  address holder,address spender,uint amount,uint nonce,uint8 v, bytes32 r, bytes32 s) public returns (bool) {

        //bytes32 digest = hashStruct(permitData);
        console.log("1111111111111");
        require(holder != address(0), "Dai/invalid-address-0");
        console.log("222222222222222222222222");
        require(holder == ecrecover(digest, v, r, s), "Dai/invalid-permit");
        console.log("3333333333333333333333");
       // require(permitData.expiry == 0 || now <= permitData.expiry, "Dai/permit-expired");
        // 用于防止重放攻击
        require(nonce == nonces[holder]++, "Dai/invalid-nonce");

        _approve(holder, spender, amount);

        return true;
    }

    function permint(bytes memory digest) public returns(bool){
        console.log("1111111111111111");
        return true;
    }

    function getPermitTypeHash() public pure returns(bytes32){
        return PERMIT_TYPEHASH;
    }
}