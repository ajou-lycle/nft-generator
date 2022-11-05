const awsConfig = require('../aws.config.json');

const http = require("http");
const path = require("path");

const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());

const { initWeb3, createNewERC1155Token } = require('./web3');
const { insertLayers } = require('../modules/db');
const { uploadToLocal, uploadLayersToLocal } = require("./upload_layers_to_local");
const { createNewCollection } = require('./create_new_collection');
const { uploadNftToS3 } = require('./upload_nft_to_s3');
const { getNFTMetadataJsonFromS3 } = require("./blind_box");

module.exports = async (app) => {
    await initWeb3();
    app.get("/", express.static(path.join(__dirname, "../public")));
    app.get("/create-new-contract", async (req, res) => {
        let statusCode;
        let status;

        try {
            await createNewERC1155Token(req.query.name, req.query.symbol, awsConfig.BASE_URI);

            statusCode = 200;
            status = `${req.query.name} token contract deployed.`
        } catch (e) {
            statusCode = 500;
            status = `error occured!`
        }

        res
            .status(statusCode)
            .contentType("text/plain")
            .end(status);
    });
    app.post(
        "/upload-layers-to-local",
        uploadToLocal.single("file"),
        async (req, res) => {
            const layerPath = `../layers/${req.body.collection}/${req.body.layer}/${req.body.item}#${req.body.percentage}.png`
            const { statusCode, status } = await uploadLayersToLocal(req.file.originalname, req.file.path, req.body.collection, req.body.layer, layerPath);

            res
                .status(statusCode)
                .contentType("text/plain")
                .end(status);
        }
    );
    app.get('/create-new-collection', async (req, res) => {
        const layersOrder = req.query.layersOrder.split(' ');
        let mapLayersOrder = []

        for (let layer of layersOrder) {
            layer.trim();

            if (layer === "Background") {
                mapLayersOrder.push({
                    name: layer,
                    options: {
                        bypassDNA: true
                    }
                })
                continue;
            }

            mapLayersOrder.push({ name: layer })
        }

        let layerConfigurations = [{
            growEditionSizeTo: req.query.growEditionSizeTo,
            layersOrder: mapLayersOrder
        }]

        const { statusCode, status } = await createNewCollection(req.query.name, req.query.description, layerConfigurations);

        const mayLayersOrderString = JSON.stringify(mapLayersOrder);

        insertLayers(req.query.name, mayLayersOrderString);

        res
            .status(statusCode)
            .contentType("text/plain")
            .end(status);
    })
    app.get('/upload-nft-to-s3', async (req, res) => {
        const { statusCode, status } = await uploadNftToS3(req.query.name);

        res
            .status(statusCode)
            .contentType("text/plain")
            .end(status);
    })
    app.get('/blind-box', async (req, res) => {
        const result = await getNFTMetadataJsonFromS3(req.query.name);

        res
        .status(200)
        .contentType("text/plain")
        .send(result);
    })
}



