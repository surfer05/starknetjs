// Imports
const { Provider, Contract, json, Account, ec, Signer } = require("starknet");
const dotenv = require("dotenv");
const { Signature } = require("ethers");

// Initialize Provider
const provider = new Provider({ sequencer: { baseUrl: "https://alpha4-2.starknet.io"} })

// Connecting the deployed JediSwap contract in Goerli Testnet
const testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
const blockIdentifier = 361046
const { abi: testAbi } = provider.getClassAt(testAddress, blockIdentifier);
if (testAbi === undefined) { throw new Error("no abi.") };
const myTestContract = new Contract(testAbi, testAddress, provider)

// Connect the account 
const privateKey = process.env.OZ_NEW_ACCOUNT_PRIVKEY;
const starkKeyPair = ec.getKeyPair(privateKey);
const accountAddress = "0x05fB39C55A5Ea0B757CC60790292b19F4B3a2620ab90A6049900b28ad7B59Cca"
const account = new Account(provider, accountAddress, starkKeyPair);

// Connect account with the contract
myTestContract.connect(account)

// Interaction with the contract with call
// describe('Jedi Swap Test Suite' , () =>{
//     let starknetSigner;

//     beforeEach(async () =>{
//         starknetSigner = new Signer({sequencer: {network: 'goerli-alpha'}})

//     })
// })


