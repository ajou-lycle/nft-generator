
const projectRootPath = process.cwd();

const path = require("path");
const fs = require("fs");

const { updateNFT, getNumOfAllDataByCollectionName, getJsonPath, getLayers } = require('../modules/db');
const { layersSetup, createDna } = require(`${projectRootPath}/src/main.js`);
const sha1 = require(`${projectRootPath}/node_modules/sha1`);

const { getObjectFromS3 } = require('./aws');

const getNFTMetadataJsonFromS3 = async (name) => {
    const result = await getLayers(name);
    const parsingResult = JSON.parse(result);
    const layersOrder = [];

    for (const layer of parsingResult) {
        layersOrder.push(layer);
    }

    var layersDir = `${projectRootPath}/layers/${name}`;

    const layerSetting = layersSetup(
        layersDir,
        layersOrder
    );

    const resultNumOfNFT = await getNumOfAllDataByCollectionName(name);

    const numOfNFT = Object.values(resultNumOfNFT[0])[0];

    if (numOfNFT === 0) {
        return {
            'result': false
        };
    }

    let dnaResult;

    do {
        var dna = sha1(createDna(layerSetting));
        dnaResult = await getJsonPath(name, dna);
    } while (dnaResult.length == 0);

    updateNFT(name, dna, true);

    return {
        'result': true,
        'data': JSON.parse(await getObjectFromS3(dnaResult[0].json_path))
    };
}

module.exports = { getNFTMetadataJsonFromS3 }