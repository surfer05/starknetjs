// Initialize Provider
import { Provider } from "starknet";
const provider = new Provider({sequencer :{network:'goerli-alpha'}})

// initialize existing pre-deployed account 0 of devnet
const privateKey = "0xe3e70682c2094cac629f6fbed82c07cd"
const starkKeyPair = ec.getKeyPair(privateKey);
const accountAddress = "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a"

const account = new Account(provider, accountAddress, starkKeyPair);

import { Account, ec , Provider } from "starknet";
