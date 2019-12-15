var MongoClient = require('mongodb').MongoClient
var dbConfig    = require('../db-config')

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

exports.getAll = function(req, res){
    MongoClient.connect(dbConfig.dbUrl, function (err, client) {
        if (err) throw err;

        var db = client.db('auction');
        var users = db.collection('users');

        users.find().toArray(function (err, result) {
            if (err) throw err;

            res.json({
                status: 'Success',
                count: result.length,
                users: result
            })
            //console.log('Password match: ' + bcrypt.compareSync("mert1234", req.body.password) );
        });
    });
};

exports.auth = function (req, res) {
    MongoClient.connect(dbConfig.dbUrl, function (err, client) {
        if (err) throw err;

        var db = client.db('auction');
        var users = db.collection('users');

        users.find({email: req.body.email}).toArray(function (err, result) {
            if (err) throw err;

            if(result.length===0){
                res.status(404).json({
                    message: 'Bu email kayıtlarımızda yok!'
                });
                return;
            }

            var userPassword = result[0].password;

            wrongPassword = !bcrypt.compareSync(req.body.password, userPassword);

            if (wrongPassword){
                res.status(403).json({
                    message: 'Girilen şifre hatalı gibi gözüküyor!'
                });
                return;
            }

            res.json({
                status: 'Success',
                match: passwordMatch,
                user: result
            })

        });
    });
};

exports.store = function(req, res) {
    MongoClient.connect(dbConfig.dbUrl, function (err, client) {
        if (err) throw err;

        var db = client.db('auction');
        var users = db.collection('users');

        users.find({email: req.body.email}).toArray(function (err, result) {
            if (err) throw err;

            if(result.length!==0){
                res.status(409).json({
                    message: 'Bu email kullanımda.'
                });
                return;
            }
            users.insertOne(req.body);
            res.json({
                message: 'Kullanıcı başarıyla kaydedildi!'
            });
        });
    });
};
