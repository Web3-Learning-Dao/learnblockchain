// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Router01.sol";

contract MyTokenMarket {
    address public routerAddress;
    address public myToken;
    address public wethAddress;

    constructor(
        address _router,
        address _token,
        address _weth
    ) {
        routerAddress = _router;
        myToken = _token;
        wethAddress = _weth;
        //授权给路由合约
        IERC20(myToken).approve(routerAddress, ~uint256(0));
    }

    function AddLiquidity(uint256 _amountTokenDesired) public payable {
        IERC20(myToken).transferFrom(
            msg.sender,
            address(this),
            _amountTokenDesired
        );
        //开始添加流动性
        IUniswapV2Router01(routerAddress).addLiquidityETH{value: msg.value}(
            myToken,
            _amountTokenDesired,
            1,
            1,
            msg.sender,
            9000000000
        );
    }

    function buyToken() public payable returns (uint256[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = wethAddress;
        path[1] = myToken;
        //不考虑滑点问题
        amounts = IUniswapV2Router01(routerAddress).swapExactETHForTokens{
            value: msg.value
        }(0, path, msg.sender, 9000000000);
    }
}