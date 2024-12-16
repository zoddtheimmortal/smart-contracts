const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");

const RPC_URL = "http://localhost:8545";
const web3 = new Web3(RPC_URL);

const bytecode = fs.readFileSync("./build/SimpleBank.bin", "utf-8");
const abi = JSON.parse(fs.readFileSync("./build/SimpleBank.abi", "utf-8"));

const contract = new web3.eth.Contract(abi);
contract.handleRevert = true;

const deploy = async () => {
	web3.eth.getChainId().then((chainId) => {
		console.log("Chain ID: ", chainId);
	});

	const accounts = await web3.eth.getAccounts();
	const def = accounts[0];
	console.log("Deploying from: ", def);

	const deployer = contract.deploy({ data: "0x" + bytecode });

	const gas = await deployer.estimateGas({ from: def });
	console.log("Estimated gas: ", gas);

	try {
		const tx = await deployer.send({
			from: def,
			gas: gas,
		});
		console.log("Contract deployed at: ", tx.options.address);

		const deployedContract = path.join(__dirname, "ContractAddress.txt");
		fs.writeFileSync(deployedContract, tx.options.address);
	} catch (err) {
		console.log(err);
	}
};

const interact = async () => {
	await deploy();
	const accounts = await web3.eth.getAccounts();
	const def = accounts[0];

	const deployedAddress = fs.readFileSync(
		path.join(__dirname, "ContractAddress.txt"),
		"utf-8"
	);
	const contract = new web3.eth.Contract(abi, deployedAddress);
	contract.handleRevert = true;

	try {
		const balance = await contract.methods.getBalance().call({ from: def });
		console.log("Balance: ", balance);

		const deposit = await contract.methods
			.deposit()
			.send({ from: def, value: 1000 });
		console.log("Deposit: ", deposit);

		const newBalance = await contract.methods
			.getBalance()
			.call({ from: def });
		console.log("New balance: ", newBalance);

		const withdraw = await contract.methods
			.withdraw(500)
			.send({ from: def });
		console.log("Withdraw: ", withdraw);

		const finalBalance = await contract.methods
			.getBalance()
			.call({ from: def });
		console.log("Final balance: ", finalBalance);
	} catch (err) {
		console.log(err);
	}
};

interact();
