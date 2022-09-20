const http = require("http");
const path = require("path");
const fs = require("fs");


const express = require("express");
const app = express();

const multer = require("multer");

const basePath = process.cwd();
const { startCreating, buildSetup, layersSetup, createDna } = require(`${basePath}/src/main.js`);
const sha1 = require(`${basePath}/node_modules/sha1`);

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "../layers"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const mkdirLayersIfNotExist = (collection, property) => {
    layersDir = `${basePath}/layers/${collection}`;
    layersPropertyDir = `${layersDir}/${property}`

    if (!fs.existsSync(layersDir)) {
        fs.mkdirSync(layersDir);
    }

    if (!fs.existsSync(layersPropertyDir)) {
        fs.mkdirSync(`${layersPropertyDir}`);
    }
};

module.exports = function (app) {
    app.get("/", express.static(path.join(__dirname, "../public")));
    app.post(
        "/upload-layer",
        upload.single("file" /* name attribute of <file> element in your form */),
        (req, res) => {
            console.log(req.body);
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, `../layers/${req.body.collection}/${req.body.layer}/${req.body.item}#${req.body.percentage}.png`);

            mkdirLayersIfNotExist(req.body.collection, req.body.layer)

            if (path.extname(req.file.originalname).toLowerCase() === ".png") {
                fs.rename(tempPath, targetPath, err => {
                    if (err) return handleError(err, res);

                    res
                        .status(200)
                        .contentType("text/plain")
                        .end("File uploaded!");
                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);

                    res
                        .status(403)
                        .contentType("text/plain")
                        .end("Only .png files are allowed!");
                });
            }
        }
    );
    app.get('/create-new-collection', function (req, res) {
        const namePrefix = req.query.name;
        const description = req.query.description;
        const growEditionSizeTo = req.query.growEditionSizeTo;
        buildSetup(namePrefix, growEditionSizeTo)

        // TODO: layersConfiguration modify
        startCreating(namePrefix, description);
        result = { "success": 1 };
        res.json(result)
    })
    app.get('/blind-box', function (req, res) {
        const namePrefix = req.query.name;

        var layersDir = `${basePath}/layers/${namePrefix}`;
        var layersOrder = [];
        var layers = fs.readdirSync(layersDir);

        for (const layer of layers) {
            layersOrder.push({ name: layer })
        }

        console.log(layersOrder)
        const layerSetting = layersSetup(
            layersDir,
            layersOrder
        );

        var dna = sha1(createDna(layerSetting))
        var dnaJson;

        var buildJsonDir = `${basePath}/build/${namePrefix}/json`;
        var jsonNames = fs.readdirSync(buildJsonDir);
        
        for (var jsonName of jsonNames) {
            var jsonPath = `${buildJsonDir}/${jsonName}`;
            var json = require(jsonPath);
            
            if(json.dna == dna) {
                dnaJson = json;
                break;
            } 
        }

        res.json(dnaJson)
    })
}



