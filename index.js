const Web3 = require("web3");
var provider = "https://mainnet.infura.io/v3/9792d706837348aebe85e5fbe61030bf";
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ", result);
});