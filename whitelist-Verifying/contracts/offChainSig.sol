import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract offChainSig {

    address signer;
    mapping(address=>bool) _mintedAddress;

    //签名者地址，表示链下用来签名的钱包地址
    function setSigner(address _signer) external {
        signer = _signer;
    }

    function _createMessageDigest(address _address, uint256 nonce) returns(bytes32){
        //将消息进行hash散列
        bytes32 hashData = keccak256(abi.encodePacked(_address, nonce));
        //将签名转换为以太坊签名的消息：加上以太坊头
        bytes32 message = ECDSA.toEthSignedMessageHash(hashData);

        return message;
    }

    function verifySignature(bytes32 digest,Coupon memory coupon) public returns(bool){

        //解析消息和签名数据，得到签名者地址
        address receivedAddress = ecrecover(digest, coupon.v, coupon.r, coupon.s);
        //address receivedAddress = ECDSA.recover(message, signature);
        //对比地址
        require(receivedAddress != address(0) && receivedAddress == signer);

        return true;
    }
    
    function mint(Coupon memory coupon ,uint256 nonce) external payable{
        require(
            verifySignature(_createMessageDigest(msg.sender,nonce),coupon),
            "veriftySignature error"
        );

        require(
            !_mintedAddress[msg.sender],
            "wallet has aready minted"
        );

        _mintedAddress[msg.sender] = true;

    }
}
