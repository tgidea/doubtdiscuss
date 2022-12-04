const nodemailer=require('nodemailer');
const path = require('path')
const envPath = path.join(__dirname, '../config.env');
require('dotenv').config({ path: envPath });
const pass=process.env.PASS;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gyanexplode@gmail.com',
      pass: `${pass}`
    }
  });
module.exports=transporter;