var express = require('express');
var path = require('path');
var multer = require('multer');
var upload = multer();
var app = express();

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
 
app.post('/submit', upload.array(), function (req, res, next) {
    console.log(req.body.message);
    console.log(req.body.phone);
    console.log(req.body.email);
    res.end('Thanks for your submission');
})

app.listen(8080);