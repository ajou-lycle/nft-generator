const awsConfig = require('../aws.config.json');
const projectRootPath = process.cwd();

const { startCreating, buildSetup, layersSetup, createDna } = require(`${projectRootPath}/src/main.js`);
const sha1 = require(`${projectRootPath}/node_modules/sha1`);

const upload = require('./upload_to_amazon');

const drawNFT = async (name) => {
    const contractAddress = await getTokenContractAddressByName(name);
    const namePrefix = contractAddress;

    var layersDir = `${projectRootPath}/layers/${namePrefix}`;
    var layersOrder = [];

    for (const layer of layers) {
        layersOrder.push({ name: layer })
    }

    const layerSetting = layersSetup(
        layersDir,
        layersOrder
    );

    var dna = sha1(createDna(layerSetting))
    var dnaJson;

    var buildJsonDir = `${baseUri}/build/${namePrefix}/json`;
    var jsonNames = fs.readdirSync(buildJsonDir);

    for (var jsonName of jsonNames) {
        var jsonPath = `${buildJsonDir}/${jsonName}`;
        var json = require(jsonPath);

        if (json.dna == dna) {
            dnaJson = json;
            break;
        }
    }

    console.log(dnaJson)
}

module.exports = { drawNFT }