const awsConfig = require('../aws.config.json');
const projectRootPath = process.cwd();

const fs = require("fs");

const { getTokenContractAddressByName } = require('./web3');
const {uploadToAWS } = require('./aws');
const { startCreating, buildSetup } = require(`${projectRootPath}/src/main.js`);


const createNewCollection = async (name, description, layerConfigurations) => {
    let statusCode;
    let status;

    try {
        const contractAddress = await getTokenContractAddressByName(name);

        const namePrefix = contractAddress;

        const nftImagesLocalPath = `${projectRootPath}/build/${name}/images`;
        const nftJsonLoaclPath = `${projectRootPath}/build/${name}/json`;
        const nftDirPathList = [nftImagesLocalPath, nftJsonLoaclPath];
        const awsBaseUri = `${awsConfig.BASE_URI}/nfts/${namePrefix}/png`;

        buildSetup(name);

        await startCreating(awsBaseUri, name, description, layerConfigurations);

        statusCode = 200;
        status = "File uploaded!";

    } catch (e) {
        statusCode = 500;
        status = "Oops! Something went wrong!";
    }

    return { statusCode, status };
}

module.exports = { createNewCollection };
