const { Web3 } = require("web3");

const web3 = new Web3("http://127.0.0.1:8545/");

// Log the chain ID to the console
web3.eth
	.getChainId()
	.then((result) => {
		console.log("Chain ID: " + result);
	})
	.catch((error) => {
		console.error(error);
	});

// Log the block number to the console
web3.eth
	.getBlockNumber()
	.then((result) => {
		console.log("Block number: " + result);
	})
	.catch((error) => {
		console.error(error);
	});

// Log the gas price to the console
web3.eth
	.getGasPrice()
	.then((result) => {
		console.log("Gas price: " + result);
	})
	.catch((error) => {
		console.error(error);
	});

// Log the accounts to the console
accounts = [];
web3.eth
	.getAccounts()
	.then((result) => {
		accounts = result;
		console.log("Accounts: ");
		for (let i = 0; i < result.length; i++) {
			console.log(result[i]);
		}
	})
	.catch((error) => {
		console.error(error);
	});

// Log the balance of the first account to the console
web3.eth
	.getBalance(accounts[0])
	.then((result) => {
		console.log("Balance: " + result);
	})
	.catch((error) => {
		console.error(error);
	});

// Add a new account
web3.eth.personal
	.newAccount("password")
	.then((result) => {
		console.log("New account: " + result);
	})
	.catch((error) => {
		console.error(error);
	});
