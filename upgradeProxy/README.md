# Upgradeable Contract

首次部署
需要部署三个合约，分别是逻辑合约，ProxyAdmin，TransparentUpgradeProxy。 逻辑合约就是我们自己的业务合约，需要满足 OpenZeppelin 可升级合约的条件。ProxyAdmin 代理持有状态，而逻辑合约实现合约提供代码

业务合约 Params 部署（先不进行初始化，initialize，本方法对应的 code 为 0x8129fc1c ）
ProxyAdmin 管理合约部署，代理合约的管理员
TransparentUpgradeableProxy 代理合约，此为用户直接交互的合约地址，一直不变；
部署需要参数，如下:

_LOGIC: 逻辑合约地址，步骤 1；
ADMIN_: 管理合约地址，步骤 2；
_DATA: 逻辑合约初始化方法调用数据，这里为 0x8129fc1c（只调用 initialize 方法，initialize 方法没有入参，如果有参数也是支持的）
合约升级：

逻辑合约 Params 升级为 ParamsNew;
调用 ProxyAdmin 进行升级;
ProxyAdmin 提供两个方法进行升级

upgrade，需要传入 proxy 地址，新的逻辑实现地址;
upgradeAndCall，需要传入 proxy 地址，新的逻辑实现地址，初始化调用数据 本例中，由于数据是保存在代理合约中，这份数据已经初始化过了，不需要再初始化，所以调用 upgrade 方法即可。 proxy: TransparentUpgradeableProxy 代理合约地址； implementation: ParamsNew 合约地址
注意事项。

可升级合约的存储不能乱，即：只能新增存储项，不能修改顺序。这种限制只影响状态变量。你可以随心所欲地改变合约的功能和事件。
不能有构造函数，使用 Initialize 合约替代，通过在方法上添加 initializer 标签，确保只被初始化一次。
继承的父合约也需要能满足升级，本例中的 Ownable 采用 OwnableUpgradeable，支持升级
可使用 OpenZeppelin 插件验证合约是否为可升级合约，以及升级时是否有冲突
