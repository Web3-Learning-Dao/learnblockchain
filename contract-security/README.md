# Contract Security Project

1. Call PrivateData 读取私有变量中的数据
    * 在链上所有的数据都是可以读取的，包括private私有变量，可以使用ethers.js 中的getStorageAt来读取指定插槽数据。
2. Delegatecall Attack 委托调用攻击
    * Delegatecall委托调用时的堆栈是当前合约的上下文，所以如果不注意调用合约和目标合约之间的插槽冲突的话，很容易被修改插槽中的数据，比如修改owner，进而被攻击。
3. Random Attack    随机数攻击
    * 在链上要是没有绝对随机数的，用任何链上数据计算得到的随机数都是可以被破解和计算出来的。如果一定要使用随机数可以使用预言机来获得，比如chainlink vrf
4. ReEntrancy Attack    重入攻击
    * 重入攻击是比较老的一种攻击，以为在合约接受eth转账时候会回调recevie 或者fallback函数，当转账合约用send或者transfer或者call实现转账功能时，接受合约都会直接回调到fallback中，并且在fallback中进行递归调用转账合约的转账接口，就实现了重入，可以无限提币。比较常用的解决方案是使用openzeppelin的ReentrancyGuard.sol来对接口进行nonReentrant()修饰，来避免重入，并且在写代码时候也注意在转账之前先修改数据状态。