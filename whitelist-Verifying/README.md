# 使用 Merkle 树做 NFT 白名单验证

1. 将所有的白名单钱包地址做为'Merkle'树的叶节点生成一棵'Merkle'树
2. 部署的合约中只存储'Merkle'树的'root hash'
3. 在'mint'时，前端生成钱包地址的'Merkle proof'，调用合约进行验证

## Merkle proof 证明生成
* 调用合约验证的 'Merkle proof' 需要在前端生成。生成过程需要用到 'merkletreejs' 和 'keccak256' 两个库，前者用于创建 Merkle 树，后者用于生成哈希。
    * npm install --save merkletreejs keccak256

## 验证过程
1. 此过程将使用 Remix IDE 进行部署和测试：

2. 使用 Remix 将合约部署到以太坊测试网 Rinkeby 中，得到合约地址为： 0xb3E2409199855ea9676dc5CFc9DefFd4A1b93eFe

3. 调用 setSaleMerkleRoot 设置 Merkle 根哈希为 0xc7ec7ffb250de2b95a1c690751b2826ec9d2999dd9f5c6f8816655b1590ca544

4. 调用 mint ，传入非法 Merkle 证明，可以看到交易失败，显示 Fail with error 'Address does not exist in list ；

5. 验证 0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33 地址对应 mint 状态是否为 false；

6. 调用 mint，传入合法的 Merkle 证明：

7. 验证 0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33 地址对应 mint 状态是否为 true。


# 链下 off-chain 发签章 进行白名单验证
1. 取得白名单地址列表，产生签章，为了安全需要在本地操作，切勿上传到云端
2. 白名单使用者开始 Mint
3. 通过钱吧地址查询签章
4. 返回签章，和智能合约交互

