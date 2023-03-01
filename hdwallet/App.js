const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const ethTx = require('ethereumjs-tx')
const express = require("express");
const Web3 = require('web3');
const bodyParser = require("body-parser");
const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    
    //website to connect, * indicates all
    res.setHeader("Access-Control-Allow-Origin", "*");

    //method to aloww access
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    //request headers to allow access
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Send cookies 
    res.setHeader('Access-Control-Allow-Credentials', true);

    //move to nxt layer
    next();
});

var server = app.listen(process.env.PORT || 5000, async function (res, req) {
    var port = server.address().port;
    console.log("server is running on PORT", port);

    

});

var pathid = 0;
const mnemonic = bip39.generateMnemonic();

app.get("/api/getMAddress", async function(req, res) {
    try {
       
        console.log("mnemonic:", mnemonic);

        var sendResponseOBject = {};
        var address;

        const seed = await bip39.mnemonicToSeed(mnemonic);
        console.log("seed:", seed);

        const root = hdkey.fromMasterSeed(seed);
        const privateKeyUint8 = root.privateKey.toString("hex");
        const  masterPrivateKey= Buffer.from(privateKeyUint8, "hex");
        console.log("Master private key:", masterPrivateKey);

        const masterPubKey = root.publicKey.toString("hex");
        console.log("master public key:", masterPubKey);

        var path = "m/44'/60'/0'/0/"+pathid;
        console.log("root:", root);
        const addressNode = root.derive(path);
        console.log("path:" , path);
        const _privatekey = Buffer.from(root.privateKey, "hex");

        // const privateKeyUint8 = Buffer.from(privateKeyHex, "hex");
        const pubKey = ethUtil.privateToPublic(addressNode._privateKey);
        console.log("pubkey as hex:", pubKey.toString("hex"));

        const pubAddress = ethUtil.pubToAddress(pubKey).toString("hex");
        console.log("pubkey to address:", pubAddress);

        address = ethUtil.toChecksumAddress(pubAddress);
        console.log("address with sum ckeck:", address);

        sendResponseOBject["MADDRESS"] = address;
        let jsonString = JSON.stringify(sendResponseOBject)
        res.send(jsonString);

        if (pathid < 100) {
            pathid++;
        }
        else {
            pathid = 0;
        }
    } catch (error) {
        console.log(error);
    }
})

app.get("/api/exportMnemonic", async function(req, res) {
    try {
        
        console.log("mnemonic:", mnemonic);
        res.send(mnemonic);
    } catch (error) {
        console.log(error);
    }
})

