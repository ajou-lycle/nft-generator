
const awsConfig = require('../aws.config.json');
const projectRootPath = process.cwd();

const fs = require("fs");

const { insertNFT } = require('../modules/db');
const { getTokenContractAddressByName } = require('./web3');
const { uploadToAWS } = require('./aws');


const uploadNftToS3 = async (name) => {
    let statusCode;
    let status;

    try {
        const contractAddress = await getTokenContractAddressByName(name);

        const namePrefix = contractAddress;

        const nftImagesLocalPath = `${projectRootPath}/build/${name}/images`;
        const nftJsonLoaclPath = `${projectRootPath}/build/${name}/json`;
        const nftDirPathList = [nftImagesLocalPath, nftJsonLoaclPath];

        setTimeout(async () => {
            for (const nftDirPath of nftDirPathList) {
                let fileList = fs.readdirSync(nftDirPath);

                for (const file of fileList) {
                    let fileType = file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
                    let filePath = `${nftDirPath}/${file}`;
                    let destination = `${contractAddress}/nfts/${fileType}/${file}`;

                    await uploadToAWS(filePath, destination);

                    if (fileType === "json") {
                        await fs.readFile(filePath, (err, fileData) => {
                            if (err) throw err;

                            const jsonData = JSON.parse(fileData);

                            const { name, dna, image } = jsonData;
                            const jsonPath = image.replace(/png/g, 'json');

                            const nameData = name.replace(/ #.*/g, '');
                            insertNFT(nameData, dna, jsonPath, false);
                        });
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

module.exports = { uploadNftToS3 };
