const http = require("http");
const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();

const multer = require("multer");

const basePath = process.cwd();
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);

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
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, `../layers/${req.body.collection}/${req.body.property}/${req.body.item}#${req.body.percentage}.png`);

            mkdirLayersIfNotExist(req.body.collection, req.body.property)

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
        buildSetup(namePrefix);
        
        // TODO: layersConfiguration modify
        startCreating(namePrefix, description);
        result = { "success": 1 };
        res.json(result)
    })
}



