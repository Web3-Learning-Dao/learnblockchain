# Gas Optimizations

Solidity 中的一些气体优化技术

1. 变量或结构体占用插槽大小
    * 一个插槽有256位，32字节大小，对于uint256 占用一个插槽，uint8占用1/32个插槽
2. Storage vs Memory
    * solidity操作storage中的数据是要比操作memory中的数据消耗gas的，使用在对全局变量(全局变量储存在storage中)遍历或者循环赋值的时候建议拷贝一份到临时变量中进行遍历，在最后进行一次赋值，这样可以减少gas。
3. 固定长度和可变长度变量
    * 固定长度数组储存在栈当中，是一块连续的内存区域，是事先预置好的，所以在部署时候比较节省gas
    * 可变长度变量储存在堆中，不是连续的内存区域，是用链表储存的非连续空间，遍历需要多消耗gas。
    ```solidity
        bytes32 public text = "Hello";
        uint[2] public arr;
        uint[] public arr1;
    ```
4. public,external,private,internal
    * external的接口 比 public接口调用可以节省gas，因为public的作用域更广
    * private只能自身合约调用，最省gas
5. 函数修饰符
    * EVM 在单个函数中最多只允许 16 个变量，因为它无法在堆栈中执行超过 16 个深度级别的操作。函数修饰符使用与放置它们的函数相同的堆栈。要解决这个问题只能在函数内部再封装一个internal函数，因为这样参数堆栈是独立的，并且共享modifier，并且interanl，参数作为引用传递，并不会复制到内存中，所以不会产生额外的gas。
6. 使用库
    * 库是不存储任何状态的无状态合约。现在，当您从合约​​中调用库的公共函数时，该函数的字节码不会与您的合约一起部署，因此您可以节省一些 gas 成本。例如，如果您的合约具有排序或数学运算等功能。您可以将它们放入库中，然后调用这些库函数为您的合约进行数学运算或排序。
    * 或者不用部署自己的库，调用部署好的库合约，比如openzepplin中的库合约
7. && 和 ||
    * 对于多重判断的条件，把最重要的，或者最容易false的条件放前进，减少判断长度
8. require
    * 确保你的 require 语句中的错误字符串长度很短，字符串的长度越长，消耗的气体就越多
    ```solidity
       require(counter >= 100, "NOT REACHED"); // Good
       require(balance >= amount, "Counter is still to reach the value greater than or equal to 100, ........
    ```
9. 释放存储空间
    * 由于存储空间需要 gas，因此您实际上可以释放存储空间并删除不必要的数据以获得 gas 退款。因此，如果您不再需要某些状态值，请使用`delete Solidity` 中的关键字进行一些 gas 退款。
 
