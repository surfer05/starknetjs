// Imports
const { Provider, Contract, json, Account, ec, Signer, constants, SequencerProvider, uint256 } = require("starknet");
// import { BigNumberish } from "starknet";
// import("starknet").Calldata

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
    let testAddress
    beforeEach(async () => {

        // Initialize Provider
        provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 1

        // Connect the account 
        const accountAddress = "0x054d853ee6f7f058a526928715ffbaea75bab1c23f8bfc4413ca92dfb16d8621"
        const starkKeyPair = ec.starkCurve.getStarkKey(PRIVATE_KEY)
        account = new Account(provider, accountAddress, starkKeyPair);
        // console.log(account)

        // Connecting the deployed JediSwap contract in Goerli Testnet
        testAddress = "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965"
        const contractClass = await provider.getClassAt(testAddress, 361046);
        if (contractClass.abi === undefined) { throw new Error("no abi.") };
        myTestContract = new Contract(contractClass.abi, testAddress, provider);

        // Connect account with the JediSwap contract
        myTestContract.connect(account)

        // Connecting the implementation contract of JediSwap
        const implementationHash = await myTestContract.get_implementation_hash();
        const implementationAbi = await provider.getClassByHash("0x" + implementationHash.implementation.toString(16));
        JediSwapImplementationContract = new Contract(implementationAbi.abi, "0x02bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965", provider)
        JediSwapImplementationContract.connect(account)

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
        const ethTokenContract = new Contract(ethTokenImplementationAbi.abi, ETHAddress, provider)


        // Connecting USDC token contract
        const USDCAddress = "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
        const USDCClass = await provider.getClassAt(USDCAddress, 47879);
        if (USDCClass.abi === undefined) { throw new Error("No abi for USDC token contract.") }
        usdcTokenContract = new Contract(USDCClass.abi, USDCAddress, provider)

        usdcTokenContract.connect(account)
        ethTokenContract.connect(account)



        // Connecting the pair contract
        const pairAddress = "0x03611992934cd904e69221e2548b0a404ca1aa0858638370df1b1f2814fde9a5"
        const pairClass = await provider.getClassAt(pairAddress)
        if (pairClass.abi === undefined) { throw new Error("no abi for pair token contract.") }
        const pairContractProxy = new Contract(pairClass.abi, pairAddress, provider)

        const pairImplementationHash = await pairContractProxy.get_implementation_hash();
        // console.log(pairImplementationHash)
        const pairImplementationAbi = await provider.getClassByHash("0x" + pairImplementationHash.implementation.toString(16))
        const pairTokenContract = new Contract(pairImplementationAbi.abi, pairAddress, provider)


        const intialEthBalance = await ethTokenContract.balanceOf(account.address);
        // console.log(intialEthBalance.balance)

        const initialUSDCBalance = await usdcTokenContract.balanceOf(account.address)
        // console.log(initialUSDCBalance.balance)

        const reserves = await pairTokenContract.get_reserves();
        // console.log(reserves)
        const reserve_0_final = reserves.reserve0;
        const reserve_1_final = reserves.reserve1;

        const token_0_decimals = 18;
        const token_0_multiplier = Math.pow(10, token_0_decimals)
        // console.log(token_0_multiplier)

        const amount_token_0 = 1 * token_0_multiplier

        const args = { testAddress }
        const amount = { low: amount_token_0, high: 0 }
        const amountOutMin = { low: 1, high: 0 }
        const path = Array.from([ethTokenContract.address, usdcTokenContract.address]);
        // console.log(Array.isArray(path))
        // console.log(path)
        // console.log(typeof path)

        await ethTokenContract.approve(testAddress, amount)

        const deadline = new Date().getTime() + 300 * 1000;
        const result = await JediSwapImplementationContract.swap_exact_tokens_for_tokens(amount, amountOutMin, [ethTokenContract.address, usdcTokenContract.address], account.address, deadline)
        console.log(result)
    })
    // it("should  add liquidity on ETH/USDC pool and assert increased balance in LP token in the caller address", async function () {

    //     const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 1   

    //     // Connecting ETH token contract
    //     const ETHAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    //     const ETHClass = await provider.getClassAt(ETHAddress, 102959);
    //     if (ETHClass.abi === undefined) { throw new Error("no abi for ETH token contract.") }
    //     ethTokenContractProxy = new Contract(ETHClass.abi, ETHAddress, provider)


    //     const ethTokenImplementationHash = await ethTokenContractProxy.implementation();
    //     const ethTokenImplementationAbi = await provider.getClassAt("0x" + ethTokenImplementationHash.address.toString(16));
    //     const ethTokenContract = new Contract(ethTokenImplementationAbi.abi, ETHAddress, provider)


    //     // Connecting USDC token contract
    //     const USDCAddress = "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
    //     const USDCClass = await provider.getClassAt(USDCAddress, 47879);
    //     if (USDCClass.abi === undefined) { throw new Error("No abi for USDC token contract.") }
    //     usdcTokenContract = new Contract(USDCClass.abi, USDCAddress, provider)

    //     usdcTokenContract.connect(account)
    //     ethTokenContract.connect(account)

    //     const token_0_decimals = 18;
    //     const token_0_multiplier = Math.pow(10, token_0_decimals)

    //     const token_1_decimals = 18;
    //     const token_1_multiplier = Math.pow(10, token_0_decimals)

    //     const amount_to_mint_token_0 = 100 * token_0_multiplier
    //     const amount0 = { low: amount_to_mint_token_0, high: 0 }

    //     await ethTokenContract.permissionedMint(account.address, amount0)

    //     const amount_to_mint_token_1 = 100 * token_1_multiplier;
    //     const amount1 = { low: amount_to_mint_token_1, high: 0 }

    //     await usdcTokenContract.permissionedMint(account.address, amount1)

    // })

})

// 0x54D853EE6F7F058A526928715FFBAEA75BAB1C23F8BFC4413CA92DFB16D8621 != .