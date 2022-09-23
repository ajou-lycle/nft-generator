const awsConfig = require('../aws.config.json');
const projectRootPath = process.cwd();

const fs = require("fs");

const { getTokenContractAddressByName } = require('./web3');
const uploadToAWS = require('./upload_to_amazon');
const { startCreating, buildSetup } = require(`${projectRootPath}/src/main.js`);


const createNewCollection = async (name, description, layerConfigurations) => {
    let statusCode;
    let status;

    try {
        const contractAddress = await getTokenContractAddressByName(name);

        const namePrefix = contractAddress;
        buildSetup(name);

        await startCreating(name, description, layerConfigurations);

        const nftImagesLocalPath = `${projectRootPath}/build/${name}/images`;
        const nftJsonLoaclPath = `${projectRootPath}/build/${name}/json`;
        const nftDirPathList = [nftImagesLocalPath, nftJsonLoaclPath];

        setTimeout(() => {
            for (const nftDirPath of nftDirPathList) {
                let fileList = fs.readdirSync(nftDirPath);

                for (const file of fileList) {
                    let fileType = file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
                    let filePath = `${nftDirPath}/${file}`;
                    let destination = `nfts/${contractAddress}/${fileType}/${file}`;

                    const result = uploadToAWS(filePath, destination);

                    if (!result) {
                        statusCode = 500;
                        status = "Oops! Something went wrong!";

                        return { statusCode, status };
                    }
                }
            }
        }, 3000);

        statusCode = 200;
        status = "File uploaded!";

    } catch (e) {
        statusCode = 500;
        status = "Oops! Something went wrong!";
    }

    return { statusCode, status };
}

module.exports = { createNewCollection };
