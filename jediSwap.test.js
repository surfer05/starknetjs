// Imports
const { Provider, Contract, json, Account, ec, Signer, constants } = require("starknet");
const { ethers } = require("ethers")
const dotenv = require("dotenv");
require("dotenv").config({ path: ".env" });
const { Signature } = require("ethers");
const PRIVATE_KEY = process.env.OZ_NEW_ACCOUNT_PRIVKEY;


describe('Jedi Swap test suite', () => {
    let provider;
    let myTestContract;
    beforeEach(async () => {
        // Initialize Provider
        const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 1

        // Connect the account 
        const privateKey = PRIVATE_KEY;
        // const hexPrivateKey = privateKey.toString(16);
        const accountAddress = "0x05fB39C55A5Ea0B757CC60790292b19F4B3a2620ab90A6049900b28ad7B59Cca"
        const starkKeyPair = ec.starkCurve.getStarkKey(PRIVATE_KEY)
        const account = new Account(provider, accountAddress, starkKeyPair);
        // console.log("Account", account)

        // Connecting the deployed JediSwap contract in Goerli Testnet
        const testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
        const contractClass = await provider.getClassAt(testAddress, 361046);
        if (contractClass.abi === undefined) { throw new Error("no abi.") };
        console.log(contractClass.abi)
        myTestContract = new Contract(contractClass.abi, testAddress, provider);


        // Connect account with the contract
        myTestContract.connect(account)
    })

    it("should return the admin address", async function () {
        const admin = await myTestContract.get_admin();
        console.log(admin)
    })

})

 // const blockIdentifier = 361046
        // const testAbi = await provider.getClassAt(testAddress, blockIdentifier);
        // console.log(abi)
        // if (testAbi === undefined) { throw new Error("no abi.") };
        // const myTestContract = new Contract(testAbi, testAddress, provider)