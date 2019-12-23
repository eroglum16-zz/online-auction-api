exports.processProductImage = function (req, res) {

    let uploadedFile = req.files.filepond;

    require('crypto').randomBytes(16, function(err, buffer) {

        var uniqueId = buffer.toString('hex');

        /*
        var filePath = './tmp/' + uniqueId;

        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath);
        }
        filePath = filePath + '/' + uploadedFile.name;
        */

        var fileNameTokens  = uploadedFile.name.split(".");
        var extension       = fileNameTokens[fileNameTokens.length-1];
        var fileName        = uniqueId + '.' + extension;
        var filePath        = './tmp/' + fileName;

        uploadedFile.mv(filePath , function(err) {
            if (err)
                return res.status(500).json({message: err});

            res.send(fileName);
        });

    });

};

exports.revertProductImage = function (req, res) {
    console.log(req.body);
    res.send("Deleted");
};