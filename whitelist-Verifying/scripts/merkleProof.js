const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

//第一步，生成白名单地址的 Merkle 树：
let whitelistAddresses = [
    '0x169841AA3024cfa570024Eb7Dd6Bf5f774092088',
    '0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33',
    '0x0a290c8cE7C35c40F4F94070a9Ed592fC85c62B9',
    '0x43Be076d3Cd709a38D2f83Cd032297a194196517',
    '0xC7FaB03eecA24CcaB940932559C5565a4cE9cFFb',
    '0xE4336D25e9Ca0703b574a6fd1b342A4d0327bcfa',
    '0xeDcB8a28161f966C5863b8291E80dDFD1eB78491',
    '0x77cbd0fa30F83a249da282e9fE90A86d7936FdE7',
    '0xc39F9406284CcAeB426D0039a3F6ADe14573BaFe',
    '0x16Beb6b55F145E4269279B82c040B7435f1088Ee',
    '0x900b2909127Dff529f8b4DB3d83b957E6aE964c2',
    '0xeA2A799793cE3D2eC6BcD066563f385F25401e95',
];
let leafNodes = whitelistAddresses.map(address => keccak256(address));
let tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

console.log('Tree: ', tree.toString());
// const root = tree.getRoot();
// console.log('Root hash is: ', root.toString('hex'));

// Output:
//
// Tree:  └─ c7ec7ffb250de2b95a1c690751b2826ec9d2999dd9f5c6f8816655b1590ca544
//    ├─ 25f76dfbdd295dd14932a7aae9350055e72e9e317cd389c62d525884cc0d0f17
//    │  ├─ 0613ec9d9455eaa91ffd480afaa50db8952ccf3cf1f04375f08f848dca194a86
//    │  │  ├─ e0c3820340c8c58fa46f9ff9c8da5037a8f544f839abe168b76aff3fa391e177
//    │  │  │  ├─ 1575cc1dded49f942913392f94716824d29b8fa45876b2db6295d16a606533a4
//    │  │  │  └─ 6abf3666623175adbce354196686c5e9853334b8eeb8324726a8ca89290c26d1
//    │  │  └─ 6c42c6099e51e28eef8f19f71765bb42c571d5c7177996f177606138f65c0c2b
//    │  │     ├─ 4d313ef5510345a10724e131139b4556d77adaa109ba87087a600ea00bf92d18
//    │  │     └─ 83260aa668bd8b075be8e34c6f6609ad5be3eee1470f7b30f46e85650097cb98
//    │  └─ b0d6f760008340e3f60414d84b305702faa6418f44f31de07b10e05bf369eb3b
//    │     ├─ f1e3a4717b4179aecf418fc3a0c92c728828ee399700d9bcb512c6424f86cb7b
//    │     │  ├─ e00eb5681327801ed923ce4913468e70f833de797cfbc3df1e68dd13000f1fa6
//    │     │  └─ d71c2d63734c3ca3c4257d118442c5796796234f77bb325759973b90e130dc62
//    │     └─ 07ff91a64cd06c27a059056430bddfdf2d54e8833c0ccaa4642b39ed3b22579f
//    │        ├─ 74b490baa6a881c8934d0aacc7fd778d1bac1e259f17856fccea372b6978bad6
//    │        └─ 3845f80821bbaa15e35bfe9ace50761f9adeebf25b8472fae6e4ff0db394b2da
//    └─ 4c880bf401add28c4e51270dfe16b28c3ca1b3d263ff7c5863fc8214b4046364
//       └─ 4c880bf401add28c4e51270dfe16b28c3ca1b3d263ff7c5863fc8214b4046364
//          ├─ 52a3b2fbc6bb6ee25b925ac9767246ceb24fd99c64a7dbc72847e6dc8dc52b81
//          │  ├─ a61d6c75021de68e08a03f83d25738ac77e5e5cce1a63b4d48c2c819254b4375
//          │  └─ 85c68207164ed77f53351eac1a14074cf5cd5b0fb1a664709adcd0ee4aa4ea8d
//          └─ 1689b05d03db07df6c1f227c6f2ad46646a3edf11684c8081b821abbaf45a6dc
//             ├─ 93b5a65af2ac0633f9f90c6e05c89c30e1d4aba0b6f98d2c2b9bda4118538d9f
//             └─ 159859f50ff6cca7ef1060dcbc1a8daf59820817ea262f3f6107b431024eb9c4

//第二步，需要生成参与 mint 地址的 Merkle 证明
let leaf = keccak256('0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33');
let proof = tree.getHexProof(leaf);
console.log('Proof of 0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33: ', proof);

//同时我们将生成一个假的证明：
// another proof, for example

let anotherWhitelistAddresses = [
    '0x169841AA3024cfa570024Eb7Dd6Bf5f774092088',
    '0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33',
    '0x0a290c8cE7C35c40F4F94070a9Ed592fC85c62B9',
    '0x43Be076d3Cd709a38D2f83Cd032297a194196517',
];
let anotherLeafNodes = anotherWhitelistAddresses.map(address => keccak256(address));
let badTree = new MerkleTree(anotherLeafNodes, keccak256, { sortPairs: true });

let badLeaf = keccak256('0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33');
let badProof = badTree.getHexProof(badLeaf);
console.log('Bad proof of 0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33: ', badProof);

// Bad proof of 0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33:  [
//     '0x1575cc1dded49f942913392f94716824d29b8fa45876b2db6295d16a606533a4',
//     '0x6c42c6099e51e28eef8f19f71765bb42c571d5c7177996f177606138f65c0c2b'
//   ]

