// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

//ERC-721转账接口
interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract EnglishAuction {
    event Start(); //拍卖开始事件
    event Bid(address indexed sender, uint amount); //钱包所有者进行拍卖事件
    event Withdraw(address indexed bidder, uint amount); //拍卖者退款事件
    event End(address winner, uint amount);//结束拍卖事件

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid
    ) {
        //构造函数中通过合约地址获取NFT的合约，赋值进行拍卖的NFTID
        nft = IERC721(_nft);
        nftId = _nftId;
        //赋值卖方地址，以及初始拍卖价格
        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    /**
        @开始拍卖调用函数，只能调用一次，并且将NFT发送给卖方地址，并且设置拍卖时间
     */
    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    /**
        @产于拍卖调用函数，判断拍卖时间和价格是否高于最高价格，并且记录bids
     */
    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        //将上次最高价格写入mapping，这里有个问题，当这次拍卖最高出价之前出过价格，那么价格会累加上去，但是最高价格还是当前出价的价格
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    /** 
        @退款出价
        @因为最高价格是在下次bid才写入mapping，使用这里可以直接退款
    */
    function withdraw() external {

        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal);
    }

    /**
        @结束拍卖并且将NFT发送给最高出价者，并且将ETH发送给seller
     */
    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
