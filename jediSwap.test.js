// Imports
const { Provider, Contract, json, Account, ec, Signer } = require("starknet");
const { ethers } = require("ethers")
const dotenv = require("dotenv");
require("dotenv").config({ path: ".env" });
const { Signature } = require("ethers");
const PRIVATE_KEY = process.env.OZ_NEW_ACCOUNT_PRIVKEY;

async function connectContract() {

}

describe('Jedi Swap test suite', () => {

    beforeEach(async () => {
        // Initialize Provider
        const provider = new Provider({ sequencer: { baseUrl: "https://alpha4-1.starknet.io" } })

        // Connect the account 
        const privateKey = PRIVATE_KEY;
        // const hexPrivateKey = privateKey.toString(16);
        const accountAddress = "0x05fB39C55A5Ea0B757CC60790292b19F4B3a2620ab90A6049900b28ad7B59Cca"
        const starkKeyPair = ec.starkCurve.getStarkKey(PRIVATE_KEY)
        const account = new Account(provider, accountAddress, starkKeyPair);
        // console.log("Account", account)

        // Connecting the deployed JediSwap contract in Goerli Testnet

        const testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
        const { abi: testAbi } = await provider.getClassAt(testAddress);
        if (testAbi === undefined) { throw new Error("no abi.") };
        const myTestContract = new Contract(testAbi, testAddress, provider);
        // const blockIdentifier = 361046
        // const testAbi = await provider.getClassAt(testAddress, blockIdentifier);
        // console.log(abi)
        // if (testAbi === undefined) { throw new Error("no abi.") };
        // const myTestContract = new Contract(testAbi, testAddress, provider)

        // Connect account with the contract
        myTestContract.connect(account)
    })

    it("should return the admin address", async function () {
        await myTestContract.call(get_admin());

    })

})