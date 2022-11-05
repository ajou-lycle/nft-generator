const web3Config = require('../truffle-config.js');

const Web3 = require("Web3");
const RLP = require("rlp")
const ERC1155TokenFactory = require('../contracts/ERC1155TokenFactory.json');
const ERC1155Token = require('../contracts/ERC1155Token.json');

let web3;
let ERC1155TokenFactoryContract;

const initWeb3 = async () => {
    web3 = new Web3(web3Config.networks.goerli_infura.provider());
    const networkID = await web3.eth.net.getId();

    const { abi } = ERC1155TokenFactory;

    const ERC1155TokenFactoryAddress = ERC1155TokenFactory.networks[networkID].address;
    ERC1155TokenFactoryContract = new web3.eth.Contract(abi, ERC1155TokenFactoryAddress);

    return { web3, ERC1155TokenFactoryContract }
}

const createNewERC1155Token = async (name, symbol, baseUri) => {
    const accounts = await web3.eth.getAccounts();
    const tokenAddress = await getTokenContractAddressByName(name);

    if (tokenAddress == '0x0000000000000000000000000000000000000000') {
        try {
            const result = await ERC1155TokenFactoryContract.methods.createNewERC1155Token(name, symbol, `${baseUri}/`).send({ from: accounts[0] });

            console.log(result)
        } catch (e) {
            console.log(e)
        }
    }
}

const getFutureAddress = async (contract) => {
    const from = contract.options.address;
    const nonce = await web3.eth.getTransactionCount(contract.options.address);
    console.log(`${nonce}`);

    const startPointContractAddress = 26;
    const endPointContractAddress = 66;
    const futureTokenContractAddress = ('0x' + web3.utils.sha3(Buffer.from(RLP.encode([from, nonce]))).substring(startPointContractAddress, endPointContractAddress)).toUpperCase();
    
    return futureTokenContractAddress;
}

const getTokenContractAddressByName = async (name) => {
    const contractAddress = await ERC1155TokenFactoryContract.methods.getContractAddressByName(name).call();

    return contractAddress;
}

module.exports = { initWeb3, createNewERC1155Token, getFutureAddress, getTokenContractAddressByName };

