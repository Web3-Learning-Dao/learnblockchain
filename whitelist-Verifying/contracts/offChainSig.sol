import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract offChainSig {

    address signer;

    //签名者地址，表示链下用来签名的钱包地址
    function setSigner(address _signer) external {
        signer = _signer;
    }

    function verifySignature(uint256 nonce, bytes calldata signature) public {
        //将消息进行hash散列
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, nonce));
        //将签名转换为以太坊签名的消息：加上以太坊头
        bytes32 message = ECDSA.toEthSignedMessageHash(hash);
        //解析消息和签名数据，得到签名者地址
        address receivedAddress = ECDSA.recover(message, signature);
        //对比地址
        require(receivedAddress != address(0) && receivedAddress == signer);
    }
    
}
