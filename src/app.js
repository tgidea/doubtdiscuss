const mongoose = require('mongoose')
const express = require('express');
const path = require('path')
const dynamicSchema = require('./dynamicCollection');
const dotenv = require('dotenv');
const blockReq = require('./blockReqschema');
const expschema2 = require('./expschema2');
const Client = require('./usernewkey');
const conn = require('./databaseconn');
const post_question = require('./post_question');
const getdata = require('./getdata');
const create_update_ip = require('./create_update_userkeyid');
const changeOption = require('./changeoption');
const deleteCollection=require('./deleteColl');
const deleteBlankCollection = require('./deleteemptycollections');
const createLength=require('./generateid');
const app = express();

const port = process.env.PORT || 8000;
// mongodb://localhost:27017/expapp

// const getmillsec = function () {
//     var d = new Date();
//     return d.getTime();
// }

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
    // res.send('hello first page here');
});

app.get('/newkey/', async (req, res) => {
    var str1 =await createLength();
    const userip = "" + req.ip;
    create_update_ip(str1, userip, res);

});

app.get('/post/:uniq_id/:quest', async (req, res) => {
    const stri = "" + req.params.uniq_id;
    // console.log('params is  ', req.params);
    const quest = req.params.quest.toString();
    //check if routed id present or not
    post_question(stri, quest, res);
    // 
});


app.get('/get/:id', async (req, res) => {
    const stri = "" + req.params.id;
    await getdata(stri, res);
});


app.get('/change/:coll_id/:quest_id/:opt', (req, res) => {
    const stri = "" + req.params.coll_id;
    const questid = "" + req.params.quest_id;
    const opti = "" + req.params.opt;
    changeOption(stri, questid, opti, res);
});

app.get('/delete/:id', async (req, res) => {
    const stri = "" + req.params.id;
    deleteCollection(stri,res);
});


app.get('/deleteblankcollections/', async (req, res) => {
    deleteBlankCollection(res); 
});

app.get("*", (req, res) => {
    res.send(`<h2>Page not found</h2>`);
});

app.listen(port, () => {
    console.log('connection succesful');
});