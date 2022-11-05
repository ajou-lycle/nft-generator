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
    return new Promise((resolve, rejects) => {
        fs.readFile(filePath, (err, fileData) => {
            s3.putObject({
                Bucket: awsConfig.BUCKET,
                Key: destination,
                Body: fileData,
                ContentType: mime.contentType(filePath)
            }, (err, data) => {
                console.log(`${filePath} ${destination}, ${err}, ${data}`);
                if (err) {
                    rejects(err);
                    throw err;
                }
                resolve();
            })
        });
    })
}

const getObjectFromS3 = async (objectKey) => {
    try {
        if (objectKey.includes(awsConfig.BASE_URI)) {
            objectKey = objectKey.substring(awsConfig.BASE_URI.length + 1, objectKey.length);
        }
        const params = {
            Bucket: awsConfig.BUCKET,
            Key: objectKey
        }

        const data = await s3.getObject(params).promise();

        return data.Body.toString('utf-8');
    } catch (e) {
        throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
}

module.exports = { uploadToAWS, getObjectFromS3 };