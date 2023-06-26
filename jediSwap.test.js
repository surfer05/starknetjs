// Imports
const { Provider, Contract, json, Account, ec, Signer, constants } = require("starknet");
// import { BigNumberish } from "starknet";

const { ethers } = require("ethers")
const dotenv = require("dotenv");
require("dotenv").config({ path: ".env" });
const { Signature } = require("ethers");
const PRIVATE_KEY = process.env.OZ_NEW_ACCOUNT_PRIVKEY;


describe('Jedi Swap test suite', () => {
    let provider;
    let myTestContract;
    let ethTokenContractProxy;
    let usdcTokenContract;
    let account;
    let JediSwapImplementationContract
    beforeEach(async () => {

        // Initialize Provider
        provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 1

        // Connect the account 
        const accountAddress = "0x05fB39C55A5Ea0B757CC60790292b19F4B3a2620ab90A6049900b28ad7B59Cca"
        const starkKeyPair = ec.starkCurve.getStarkKey(PRIVATE_KEY)
        account = new Account(provider, accountAddress, starkKeyPair);
        // console.log(account)

        // Connecting the deployed JediSwap contract in Goerli Testnet
        const testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
        const contractClass = await provider.getClassAt(testAddress, 361046);
        if (contractClass.abi === undefined) { throw new Error("no abi.") };
        myTestContract = new Contract(contractClass.abi, testAddress, provider);

        // Connecting the implementation contract of JediSwap
        const implementationHash = await myTestContract.get_implementation_hash();
        const implementationAbi = await provider.getClassByHash("0x" + implementationHash.implementation.toString(16));
        JediSwapImplementationContract = new Contract(implementationAbi.abi, "0x064e7d628b1b2aa04a35fe6610b005689e8b591058f7f92bf4eb234e67cf403b", provider)
        JediSwapImplementationContract.connect(account)

        // Connect account with the JediSwap contract
        myTestContract.connect(account)






        // // Connecting USDC token contract

        // // connect account with the USDC token contract 
        // usdcTokenContract.connect(account)

    })

    it("should swap 1 ETH for USDC and assert increased balance of USDC in caller address", async function () {

        const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 1        



        // Connecting ETH token contract
        const ETHAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
        const ETHClass = await provider.getClassAt(ETHAddress, 102959);
        if (ETHClass.abi === undefined) { throw new Error("no abi for ETH token contract.") }
        ethTokenContractProxy = new Contract(ETHClass.abi, ETHAddress, provider)


        const ethTokenImplementationHash = await ethTokenContractProxy.implementation();
        const ethTokenImplementationAbi = await provider.getClassAt("0x" + ethTokenImplementationHash.address.toString(16));
        const ethTokenContract = new Contract(ethTokenImplementationAbi.abi, "0x" + ethTokenImplementationHash.address.toString(16), provider)


        // Connecting USDC token contract
        const USDCAddress = "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
        const USDCClass = await provider.getClassAt(USDCAddress, 47879);
        if (USDCClass.abi === undefined) { throw new Error("No abi for USDC token contract.") }
        usdcTokenContract = new Contract(USDCClass.abi, USDCAddress, provider)

        // const usdcTokenImplementationHash = await usdcTokenContractProxy.implementation();
        // const usdcTokenImplementationAbi = await provider.getClassAt("0x" + usdcTokenImplementationHash.address.toString(16))
        // const usdcTokenContract = new Contract(usdcTokenImplementationAbi.abi, "0x" + usdcTokenImplementationHash.address.toString(16), provider)

        usdcTokenContract.connect(account)
        ethTokenContract.connect(account)

        const intialEthBalance = await ethTokenContract.balanceOf(account.address);
        console.log(intialEthBalance.balance)




    })

}, 10000)

