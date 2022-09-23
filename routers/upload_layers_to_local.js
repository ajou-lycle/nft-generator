const path = require("path");
const fs = require("fs");

const projectRootPath = process.cwd();

const multer = require('multer');
const uploadToLocal = multer({
    dest: "../layers"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const mkdirIfNotExist = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath);
            return true;
        } catch (e) {
            return false;
        }
    }
};

const uploadLayersToLocal = async (fileName, filePath, collection, property, layerPath) => {
    const tempPath = filePath;
    const targetPath = path.join(__dirname, layerPath);
    const layerDir = `${projectRootPath}/layers/${collection}`;
    const layerPropertyDir = `${layerDir}/${property}`

    const dirPathList = [layerDir, layerPropertyDir]

    let statusCode;
    let status;

    for (const dirPath of dirPathList) {
        const result = mkdirIfNotExist(dirPath)
        
        if (result == false) {
            statusCode = 500;
            status = "Oops! Something went wrong!";

            return { statusCode, status };
        }
    }

    if (path.extname(fileName).toLowerCase() === ".png") {
        try {
            fs.renameSync(tempPath, targetPath);
            statusCode = 200;
            status = "File uploaded!";

        } catch (e) {
            statusCode = 500;
            status = "Oops! Something went wrong!";
        }
    } else {
        try {
            fs.unlinkSync(tempPath);
            statusCode = 403;
            status = "Only .png files are allowed!";

        } catch (e) {
            statusCode = 500;
            status = "Oops! Something went wrong!";
        }
    }

    return { statusCode, status };
}

module.exports = { uploadToLocal, uploadLayersToLocal }