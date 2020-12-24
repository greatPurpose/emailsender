'use strict';
const express = require('express');
const path = require('path');
const cors = require("cors");
const serverless = require('serverless-http');
const querystring = require('querystring');

const app = express();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

const router = express.Router();
app.get('/', (req, res) => {
});

app.post('/book', cors(), (req, res) =>{ 
  console.log('checking....');
  mail(req, res); 
  res.json({ postBody: req.body })
});

app.post('/', (req, res) => {
});

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

async function mail(req, res) {

  var bodyStr = '';
  var bodyParam;
    req.on("data",function(chunk){
        bodyStr += chunk.toString();
    });
    req.on("end",function(){
        bodyParam = querystring.parse(bodyStr);
    });

    nodemailer.createTestAccount((err, account) => {
      if (err) {
          console.error('Failed to create a testing account. ' + err.message);
          return process.exit(1);
      }
  
      console.log('Credentials obtained, sending message...');
  
      // Create a SMTP transporter object
      let transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
              user: account.user,
              pass: account.pass
          }
      });

      console.log(bodyParam);
  
      // Message object
      let message = {
        from: "great.purpose@outlook.com", // sender address
        to: "harakiriwest@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      };
  
      transporter.sendMail(message, (err, info) => {
          if (err) {
              console.log('Error occurred. ' + err.message);
              return process.exit(1);
          }
  
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
  });

}

module.exports = app;
module.exports.handler = serverless(app);

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
