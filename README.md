## chainlink OKEX专场 学习记录

### Week 1 合约编写和部署

**部署合约：Counts**

* 编写一个Counts合约
* 使用hardhat部署到rinkeby测试链上
* 编写mocha测试脚本，使用hardhat test进行合约测试

### Week 2 SOLIDITY

#### W2_1

* 编写一个Bank合约
* 通过 Metamask 向Bank合约转账ETH
* 在Bank合约记录每个地址转账⾦额
* 编写 Bank合约withdraw(), 实现提取出所有的

Rinkeby合约地址：0xD0480235dC5E3993702791499d637B13dF49412C

#### W2_2

* 编写合约Score，⽤于记录学⽣（地址）分数：
* 仅有⽼师（⽤modifier权限控制）可以添加和修改学⽣分数
* 分数不可以⼤于 100；
* 编写合约 Teacher 作为⽼师，通过 IScore 接⼝调⽤修改学⽣分数。

Rinkeby合约地址：0x21AeA93F9C95Db7b65584877A2023522590A8cAD

### Week 3 智能合约及DAPP开发

#### W3_1

* 发⾏⼀个 ERC20 Token： 
  * 可动态增发（起始发⾏量是 0） 
  * 通过 ethers.js. 调⽤合约进⾏转账
* 编写⼀个Vault 合约：
  * 编写deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额 ， ⽤从前端调⽤（Approve，transferFrom） 
  * 编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
  * 前端显示⽤户存款⾦额
  
#### W3_2

* 发行一个 ERC721 Token
   * 使用 ether.js 解析 ERC721 转账事件(加分项：记录到数据库中，可方便查询用户持有的所有NFT)
   * (或)使用 TheGraph 解析 ERC721 转账事件

### Week 4 DEX 分析

#### W4_1

* 部署自己的 ERC20 合约 MyToken
* 编写合约 MyTokenMarket 实现：
   * AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
   * buyToken()：用户可调用该函数实现购买 MyToken

#### W4_2

* 在上一次作业的基础上：
   * 完成代币兑换后，直接质押 MasterChef
   * withdraw():从 MasterChef 提取 Token 方法

### Week 5 抵押借贷及衍⽣品协议

#### w5_1

* 以太坊测试网上部署两个自己的ERC20合约MyToken，分别在Uniswap V2、V3(网页上)添加流动性
* 作业：编写合约执行闪电贷（参考V2的ExampleFlashSwap）：
   * uniswapV2Call中，用收到的 TokenA 在 Uniswap V3 的 SwapRouter 兑换为 TokenB 还回到 uniswapV2 Pair 中。

### W5_2

* 在一笔交易中完成（模拟闪电贷交易）
   * 在 AAVE 中借款 token A
   * 使用 token A 在 Uniswap V2 中交易兑换 token B，然后在 Uniswap V3 token B 兑换为 token A
   * token A 还款给 AAVE  


### Week 6 稳定币及 DAO

#### W6_1

* 设计一个看涨期权Token:
   * 创建期权Token 时，确认标的的价格与行权日期；
   * 发行方法（项目方角色）：根据转入的标的（ETH）发行期权Token；
   * （可选）：可以用期权Token 与 USDT 以一个较低的价格创建交易对，模拟用户购买期权。
   * 行权方法（用户角色）：在到期日当天，可通过指定的价格兑换出标的资产，并销毁期权Token
   * 过期销毁（项目方角色）：销毁所有期权Token 赎回标的。

#### w6_2

* 实现⼀个通过 DAO 管理资⾦的Treasury：
   * 管理员可以从Treasury合约中提取资⾦withdraw（）
   * 治理Gov合约作为管理员
   * 通过发起提案从Treasury合约资⾦
  
