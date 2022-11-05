require("dotenv").config({ path: "../.env" });
const mysql = require('mysql');

console.log();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

connection.connect();

const insertNFT = (name, dna, json_path, already) => {
    var sql = 'INSERT INTO NFTS_METADATA(name, dna, json_path, already) VALUES ?';
    var values = [[name, dna, json_path, already]];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Number of records NFT inserted: " + result.affectedRows);
    })
}

const insertLayers = (name, layers) => {
    var sql = 'INSERT INTO NFTS_LAYERS(name, layers) VALUES ?';
    var values = [[name, layers]];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Number of records Layers inserted: " + result.affectedRows);
    })
}

const updateNFT = (name, dna, already) => {
    var sql = `UPDATE NFTS_METADATA SET already = ? WHERE name = '${name}' AND dna = '${dna}'`;
    var values = [[already]];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Number of records NFT updated: " + result.affectedRows);
    })
}

const getNumOfAllDataByCollectionName = async (name) => {
    var sql = 'SELECT COUNT(*) FROM NFTS_METADATA WHERE name = ? and already = ?';
    var values = [name, false];

    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });
}

const getJsonPath = async (name, dna) => {
    var sql = 'SELECT json_path FROM NFTS_METADATA WHERE name = ? AND dna = ? AND already = ?';
    var values = [name, dna, false];
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });

}

const getLayers = (name) => {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT layers FROM NFTS_LAYERS WHERE name = ?';
        var values = [name];
        connection.query(sql, [values], (err, result) => {
            if (err) reject(err);
            resolve(result[0].layers);
        });
    });
}

module.exports = { connection, insertNFT, insertLayers, updateNFT, getNumOfAllDataByCollectionName, getJsonPath, getLayers };