// Imports
const { Provider, Contract, json, Account, ec, Signer } = require("starknet");
const dotenv = require("dotenv");
const { Signature } = require("ethers");

describe('Jedi Swap test suite', () => {

    beforeEach(async () => {
        // Initialize Provider
        const provider = new Provider({ sequencer: { baseUrl:"http://127.0.0.1:5050" } })

        // Connecting the deployed JediSwap contract in Goerli Testnet
        const testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
        const { abi: testAbi } = await provider.getClassAt(testAddress);
        if (testAbi === undefined) { throw new Error("no abi.") };
        const myTestContract = new Contract(testAbi, testAddress, provider)

        // Connect the account 
        const privateKey = "0xe3e70682c2094cac629f6fbed82c07cd";
        const starkKeyPair = ec.getKeyPair(privateKey);
        const accountAddress = "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a"
        const account = new Account(provider, accountAddress, starkKeyPair);

        // Connect account with the contract
        myTestContract.connect(account)
    })

    it("should return the admin address", async function() {
        await myTestContract.call(get_admin());

    })

})