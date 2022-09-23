const awsConfig = require('../aws.config.json');

const fs = require("fs");
const mime = require('mime-types')

const aws = require('aws-sdk');

aws.config.update({
    region: awsConfig.REGION,
    accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: awsConfig.AWS_SECRET_KEY
})

const s3 = new aws.S3();

const uploadToAWS = (filePath, destination) => {
    try {
        fs.readFile(filePath, (err, fileData) => {
            s3.putObject({
                Bucket: awsConfig.BUCKET,
                Key: destination,
                Body: fileData,
                ContentType: mime.contentType(filePath)
            }, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        });
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = uploadToAWS;
