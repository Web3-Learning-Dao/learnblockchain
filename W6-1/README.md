#### W6_1

* 设计一个看涨期权Token:
   * 创建期权Token 时，确认标的的价格与行权日期；
   * 发行方法（项目方角色）：根据转入的标的（ETH）发行期权Token；
   * （可选）：可以用期权Token 与 USDT 以一个较低的价格创建交易对，模拟用户购买期权。
   * 行权方法（用户角色）：在到期日当天，可通过指定的价格兑换出标的资产，并销毁期权Token
   * 过期销毁（项目方角色）：销毁所有期权Token 赎回标的。

### 部署地址
UsdcToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
PriceUpToken deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

### 测试脚本

```npx hardhat test```
