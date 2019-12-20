var MongoClient = require('mongodb').MongoClient;
var dbConfig    = require('../db-config');
var collectionName  = 'sales';
var fs = require('fs');

exports.save = function(req, res) {
    MongoClient.connect(dbConfig.dbUrl, function (err, client) {
        if (err) throw err;

        var db = client.db(dbConfig.dbName);
        var sales = db.collection(collectionName);

        var files = req.body.files;

        var i, src, dst;
        for(i in files){
            src = "./tmp/"+files[i];
            dst = "./public/images/products/"+files[i];
            fs.copyFile(src, dst, (err) => {
                if (err){
                    res.status(500).json({
                        message: err
                    });
                }
            });
            fs.unlink(src, (err) => {
                if (err){
                    res.status(500).json({
                        message: err
                    });
                }
            });
        }

        //sales.insertOne(req.body);
        res.json({
            message: 'Satış başarıyla kaydedildi!'
        });
    });
};