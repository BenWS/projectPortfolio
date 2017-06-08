"use strict";

var express = require('express');
var path = require('path');
var multer = require('multer');
var mongo = require('mongodb').MongoClient;
var upload = multer();
var app = express();

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
 
app.post('/submit', upload.array(), function (req, res, next) {
    
    
    //database connectivity
    mongo.connect(process.env.MONGOLAB_CHARCOAL_URI, function (err, db) {
		var submitColl = db.collection('submit');
		submitColl.insert({'phone':req.body.phone, 'email':req.body.email, 'message':req.body.message})
		db.close();
	}
    
    //begin nodemailer logic
        const nodemailer = require('nodemailer');
    
    //testing whether page position has been captured
    console.log(req.body.pagePosition);
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: process.env.service,
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions = {
        from: req.body.email,// sender address
        to: 'shippeyben@gmail.com', // list of receivers
        subject: 'New Project Portfolio Form Submission', // Subject line
        text: req.body.message, // plain text body
        html: '<b>Message:</b> ' + req.body.message + '<br>' + '<b>Phone:</b>' + req.body.phone // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        
    });
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(process.env.PORT);