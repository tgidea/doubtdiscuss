const mongoose = require('mongoose')
// const dotenv = require('dotenv');
require('dotenv').config({ path: __dirname + '/config.env' });
const url2 = process.env.DATABASE;
const conn = mongoose.connect(url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('success connection'))
    .catch((err) => console.log(err))

    module.exports=conn;