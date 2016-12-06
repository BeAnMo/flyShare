/*
- linux: process.env.HOME
- windows: process.env.USERPROFILE
TODOS:
- when app is launched, have node check contents of 'downloads' and then
  - updated DB with new directory listing
- allow user to choose folder to share
*/
var express = require('express');
var multer = require('multer');
var mdns = require('mdns');
var mime = require('mime');
var fs = require('fs');

var app = express();
var port = parseInt(process.argv[3]);
var serverName = process.argv[2];
var homeDir = './app';

var upload = multer({dest: 'app/Downloads/'});
var advertisement = mdns.createAdvertisement(mdns.tcp('flyweb'),
    port, {
        name: serverName
});

app.use(express.static(homeDir));

app.listen(port, function(){
    read_shared_dir('./app/Downloads');
    advertisement.start();
    console.log('\n\t*** On host device: http://localhost:' + port + ' ***\n' + 
                '\tCheck Out ' + serverName + ' server on other devices!\n');
});

app.post('/Downloads', upload.single('file'), function(req, res){
    console.log(req.file);

    var tmpPath = req.file.path;
    var targetPath = 'app/Downloads/' + req.file.originalname;

    res.set('Content-Type', req.file.mimetype);
    res.status(200);

    // piping creates 2 files
    //var src = fs.createReadStream(tmpPath);
    //var dest = fs.createWriteStream(targetPath);
    //src.pipe(dest);
 
    // renames temp file as original name, deleting duplicate 
    fs.rename(tmpPath, targetPath, function(err){
        if(err) console.log(err);
        return;
    });

    // this is what will be added to the database
    var newFile = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        date: new Date(),
        path: 'Downloads/' + req.file.originalname
    };
  
    newFileEntry(newFile);

    res.end();
});

function read_shared_dir(path){
    fs.readdir(path, function(err, files){
        if(err) throw err;

        files.forEach(function(file){
            console.log(file + '\t' + mime.lookup(file));
        });
        console.log('\t ^^^ Current contents of: ' + path + '\n');
    });
}

function newFileEntry(newFile){
    var dirListObj;
    var updatedJSON;
    fs.readFile('app/shared.json', function(err, data){
        if(err) console.log(err.toString());

        dirListObj = JSON.parse(data);
        dirListObj.push(newFile);
        updatedJSON = JSON.stringify(dirListObj);

        fs.writeFile('app/shared.json', updatedJSON, 'utf8', function(err){
            if(err) console.log(err.toString());

            console.log('shared.json updated');
        });
    });
}

