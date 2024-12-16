const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");

const RPC_URL = "http://localhost:8545";
const web3 = new Web3(RPC_URL);

const bytecode = fs.readFileSync("./GetSet.bin", "utf-8");
const abi = require("./GetSet.json");

const contract = new web3.eth.Contract(abi);
contract.handleRevert = true;

async function deploy() {
	web3.eth.getChainId().then((chainId) => {
		console.log("Chain ID: ", chainId);
	});

	const accounts = await web3.eth.getAccounts();
	const def = accounts[0];
	console.log("Deploying from: ", def);

	const deployer = contract.deploy({ data: "0x" + bytecode, arguments: [1] });

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
}

async function interact() {
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
		const value = await contract.methods.get().call({ from: def });
		console.log("Value: ", value);

		const receipt = await contract.methods
			.set(10)
			.send({ from: def, gas: 1000000 });

		console.log("Transaction hash: ", receipt.transactionHash);

		const newValue = await contract.methods.get().call({ from: def });
		console.log("New value: ", newValue);
	} catch (err) {
		console.log(err);
	}
}

interact().catch((err) => {
	console.log(err);
});
