const eth_util = require('ethereumjs-util');

// paste in the private key we provided here. NEVER PASTE YOUR OWN PRIVATE KEY INTO UNTRUSTED APPLICATIONS
const privateKey = '0x7e1e3706c2c783ea4aebbc787ef949944330272e91e05b67d0d624aabf2b93de';
// get a public key from a given private key
const privateKeyAsBuffer = eth_util.toBuffer(privateKey);

// get public key from private key buffer
const publicKey = eth_util.privateToPublic(privateKeyAsBuffer);

// turn public key buffer into a string
const publicKeyString = eth_util.bufferToHex(publicKey);

// log public key string to console
console.log(publicKeyString);

// turn public key string into a buffer
const publicKeyAsBuffer = eth_util.toBuffer(publicKeyString);

// get address from a public key (as a buffer)
const addressBuffer = eth_util.pubToAddress(publicKeyAsBuffer);

// turn the buffer of an address into a hex string
const address = eth_util.bufferToHex(addressBuffer);

// log address string to console
console.log(address);

