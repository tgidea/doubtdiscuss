const mongoose = require('mongoose')
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path')
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, limitId } = require('./users');
const dynamicSchema = require('./schema/dynamicCollection');
const auth = require('./middleware/auth');
const authpage = require('./middleware/authpage');
const authpageNoId = require('./middleware/authpageNoId');
const authstart = require('./middleware/authstart');
const profileAuth = require('./middleware/profileauth');
const nodemailer = require('nodemailer');
const transporter = require('./functionality/nodemailer');
const post_comment = require('./functionality/post_comment');
const blockReq = require('./schema/blockReqschema');
const expschema2 = require('./schema/expschema2');
const Client = require('./schema/usernewkey');
const conn = require('./databaseconn');
const editId = require('./functionality/editId');
const IdData = require('./schema/idSchemaModal');
const idSchema = require('./schema/idSchema');
const deleteDocument = require('./functionality/deleteDocument');
const get_comment = require('./functionality/getComment');
const post_question = require('./functionality/post_question');
const getdata = require('./functionality/getdata');
const create_update_ip = require('./functionality/create_update_userkeyid');
const changeOption = require('./functionality/changeoption');
const deleteCollection = require('./functionality/deleteColl');
const deleteBlankCollection = require('./functionality/deleteemptycollections');
const createLength = require('./functionality/generateid');
const loginFun = require('./functionality/login');
const Register = require('./schema/registerSchema');
const registerFun = require('./functionality/registerFun');
const authlogout = require('./middleware/authlogout');

require('dotenv').config({ path: __dirname + '/config.env' });
const pass = process.env.PASS;
const JWT_KEY = process.env.JWT_TOKEN;

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 9001;
const http = require('http').createServer(app);
const io = require('socket.io')(http)
// mongodb://localhost:27017/expapp


const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());

const blocked = {};
const blockedComm = {};

app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(staticPath, 'login.html'));
    }
    catch (err) {
        res.status(400).render('error', { "error": "Something went wrong" });
    }
});

app.get('/main', authstart, async (req, res) => {
    try {
        const username = req.username;
        res.status(201).render('main', { username: username, link: "/profile" });
    }
    catch (err) {
        console.log(err);
        res.status(201).render('main', { username: "Login", link: "/" });
    }
});

app.get('/pag/:id', authpage, async (req, res) => {
    try {
        const id = req.params.id.toString();
        const username = req.username;
        res.status(201).render('page', { name: id, link: "/profile", username: username });
    }
    catch (err) {
        res.status(201).render('page', { name: "", link: "#", username: "" });
    }
});

app.get('/pag/', authpageNoId, async (req, res) => {
    try {
        const username = req.username;
        res.status(201).render('page', { name: "", link: "/profile", username: username });
    }
    catch (err) {
        res.status(201).render('page', { name: "", link: "#", username: "" });
    }

});

app.get('/profile', profileAuth, async (req, res) => {
    try {
        const username = req.username;
        const name = req.name;
        const email = req.email;
        const ids = req.ids;
        res.status(201).render('profile', { username, name, email, ids });
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error', { "error": `Something went wrong` });
    }
})


app.post('/register/', async (req, res) => {
    try {
        registerFun(req, res);
    }
    catch (err) {
        console.log(err);
        console.log('Error in processing /register');
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.post('/login/', async (req, res) => {
    try {
        loginFun(req, res);
    }
    catch (err) {
        console.log('Error occur in /login');
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.get('/logout', authlogout, async (req, res) => {
    try {
        res.clearCookie('jwt');
        const temp = await req.user.save();
        res.redirect('/');
    }
    catch (err) {
        res.status(400).render('error', { "error": `Logout fails` });
    }
})

app.get('/newkey/', auth, async (req, res) => {
    try {
        var str1 = await createLength();
        const username = req.username;
        create_update_ip(str1, username, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.post('/postQues', auth, async (req, res) => {
    try {
        const stri = req.body.keyvalue.toString();
        const username = req.username;
        const quest = req.body.question;
        post_question(stri, quest, username, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.post('/comment', auth, async(req, res) => {
    try {
        const id = req.body.id.toString();
        const username = req.username;
        const comment = req.body.commentVal;
        const quesId = req.body.quesId;
        const details = await IdData.findOne({ name: id });
        if (blockedComm[`${req.username}`] == undefined || (Date.now() - blockedComm[`${req.username}`]) > 3000) {
            blockedComm[`${req.username}`]=Date.now();
        }
        else{
            return res.json({"result":"Too quickly next attempt.Please try after some time"});
        }
        if (details) {
            if (details.active) {
                if (details.deniedTo.indexOf(req.username) == -1) {
                    post_comment(id, quesId, comment, req, res);
                }
                else {
                    res.status(400).send({ "result": "Sorry,You don't have permission." });
                }
            }
            else {
                res.status(400).send({ "result": "All operations are stopped by owner."});
            }
        }
        else {
            res.status(400).send({"result":"Id not found"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.get('/getComment/:id/:questId', auth,async(req,res)=>{
    try{
        const id = req.params.id;
        const questId = req.params.questId;
        const details = await IdData.findOne({ name: id });
        if (blockedComm[`${req.username}`] == undefined || (Date.now() - blockedComm[`${req.username}`]) > 2000) {
            blockedComm[`${req.username}`]=Date.now();
        }
        else{
            return res.json({"result":"You are attempting too. Please try after some time"});
        }
        if (details) {
            if (details.active) {
                if (details.deniedTo.indexOf(req.username) == -1) {
                    get_comment(id, questId, req, res);
                }
                else {
                    res.status(400).send({ "result": "Sorry,You don't have permission." });
                }
            }
            else {
                res.status(400).send({ "result": "All operations are stopped by owner."});
            }
        }
        else {
            res.status(400).send({"result":"Id not found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.get('/get/:id', auth, async (req, res) => {
    try {
        const stri = "" + req.params.id;
        await getdata(stri, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/id/:idName', profileAuth, async (req, res) => {
    try {
        const idName = req.params.idName;
        const idInfo = await IdData.findOne({ name: idName })
        const username = idInfo.author;
        const limit = idInfo.limit;
        const coAuthor = idInfo.coAuthor.toString().trim();
        const deniedTo = idInfo.deniedTo.toString().trim();
        const active = idInfo.active;
        if (coAuthor.indexOf(req.username) > -1 || idInfo.author == req.username) {
            res.render('edit', { idName, username, limit, coAuthor, deniedTo, active });
        }
        else {
            res.status(404).render('error', { "error": `Page not found` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).render('error', { "error": `Something went wrong` });
    }
})

app.get('/edit/:idName/:fun/:event/', profileAuth, async (req, res) => {
    try {

        const idName = req.params.idName;
        const fun = req.params.fun;
        const event = req.params.event;
        let idInfo;
        try {
            idInfo = await IdData.findOne({ name: idName });
        }
        catch (err) {
            console.log(err);
            res.status(403).send({ result: "Not accessible" });
            return;
        }
        if (req.ids.indexOf(idName) > -1 || idInfo.coAuthor.indexOf(req.username) > -1) {
            editId(res, req, idName, fun, event);
        }
        else {
            res.status(400).render('error', { "error": `Please contact owner` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error', { "error": `Something went wrong` });
    }
})
const emailReq = {};
app.get('/outverify', async (req, res) => {
    try {
        const mail = req.query.email;
        let username = req.query.username;
        if (emailReq[`${mail}`] == undefined || Date.now() - emailReq[`${mail}`] > 13200000) {

            // console.log(emailReq);
            username = username.replace('%20', " ");
            const details = await Register.findOne({ email: mail });
            if (details) {
                emailReq[`${mail}`] = Date.now();
                // if (details.username == username) {
                const id = details._id;
                const name = details.username;
                var mailOptions = {
                    from: 'gyanexplode@gmail.com',
                    to: `${mail}`,
                    subject: 'Verify Account',
                    html: `<h1>Welcome ${name}</h1><h4> Thanks for choosing doubtHelper</h4>
                        <p>Please link <a href="https://doubthelper.herokuapp.com/verify?id=${id}&name=${name} ">here</a> to verify your email.</p>
                        `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(400).render('error', { "error": "Something wrong happened. Please try again later after some time." });
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        if (info) {
                            res.status(201).render('success', { "text": `Verification email has been sent` });
                        }
                        else {
                            res.status(400).render('error', { "error": "Something wrong happened. Please try again." });
                        }
                    }
                });                
            }
            else {
                res.status(400).render('error', { "error": ` username or email are not matching` });

            }
        }
        else {
            res.status(400).render('error', { "error": `Email already sended.` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error', { "error": ` username or email are not matching` });
    }
})
app.get('/verify/', async (req, res) => {
    try {
        const _id = req.query.id.toString();
        let username = req.query.name.toString();
        username = username.replace('%20', " ").toString().toLowerCase().trim();
        const details = await Register.findOne({ _id: _id });
        if (details.username.toString().trim() == username.toString().trim()) {
            const result = await Register.updateOne({ _id },
                {
                    $set: {
                        active: true
                    }
                });
            if (result) {
                res.status(201).render('success', { "text": `Your email has been verified succesfully` });
            }
            else {
                res.status(400).render('error', { "error": `Something went wrong` });
            }
        }
        else {

            res.status(400).render('error', { "error": `Invalid` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error', { "error": `Invalid` });
    }
})

app.get('/change/:coll_id/:quest_id/:opt/:status', auth, async (req, res) => {
    try {    
        if (blocked[`${req.username}`] == undefined || (Date.now() - blocked[`${req.username}`]) > 3000) {            
            const stri = "" + req.params.coll_id;
            const questid = "" + req.params.quest_id;
            const opti = "" + req.params.opt;
            const status = "" + req.params.status;
            changeOption(stri, questid, opti, status, res, req);
        }
        else{
            res.status(403).send({"result":"Too frequent request"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/delete/:id', auth, async (req, res) => {
    try {
        const stri = "" + req.params.id;
        deleteCollection(stri, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/deleteDocument/:collection/:document', auth, async (req, res) => {
    try {
        const collection = "" + req.params.collection;
        const document = req.params.document;
        const username = req.username;
        deleteDocument(req, res, collection, document, username);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.get('/deleteblankcollections/', async (req, res) => {
    try {
        deleteBlankCollection(res);
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error', { "error": `Something went wrong` });
    }
});

//Socket connections
const sendChecker = async () => {
    try {
        setTimeout(sendChecker, 8000);
        io.sockets.emit('active', { count: 1 });
    }
    catch (err) {
        console.log(err);
    }
}
sendChecker();
io.on('connection', socket => {
    socket.on('joinId', async (userInfo) => {
        try {
            if (limitId(socket.id)) {                
                const alreadyOrNot = getCurrentUser(socket.id);
                if (userInfo.name != 'Login' && userInfo.name != 'login' && alreadyOrNot == undefined) {
                    const user = userJoin(socket.id, userInfo.name, userInfo.id);
                    userInfo.name = userInfo.name.replace('/n', "").trim();
                    socket.join(user.room);
                    socket.broadcast.to(user.room).emit('check', `${user.name} has joined`);
                }
            }
            else {
                socket.emit('refresh', "Too frequent request. Refreshing..");
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    // Listen for chatMessage
    socket.on('update', async (msg) => {
        try {
            const user = getCurrentUser(socket.id);
            let pass = false;
            if (user == undefined) {
                socket.emit('refresh', 'Connection Broke, Refreshing...');
                return;
            }
            if (blocked[`${user.name}`] == undefined || (Date.now() - blocked[`${user.name}`]) > 3000) {
                pass = true;
            }
            if (limitId(socket.id) && pass) {
                if (msg.message == 'Question deleted' || msg.message == 'option change' || msg.message == 'question post' || msg.message == 'All quesiton deleted') {
                    const status = await IdData.findOne({ name: `${user.room}` });
                    if (status.deniedTo.toString().indexOf(`${user.name}`) < 0) {
                        if (user != undefined && user.room != undefined ){
                            if(msg.data.length>0 && msg.message == 'option change'){
                                socket.broadcast.to(user.room).emit('optionChange',
                                {
                                    "message": `${msg.data}  ${msg.message} by ${user.name}`,
                                    "updatedVal" : `${msg.updatedVal}`,
                                    "option" : `${msg.option}`,
                                    "question" : `${msg.question}`
                                })
                            }
                            else{
                                socket.broadcast.to(user.room).emit('new',` ${msg.data}  ${msg.message} by ${user.name}`);
                            }
                        }
                        else {
                            socket.emit('refresh', "Connection Broke, Refreshing...");
                        }
                    }
                    else {
                        socket.emit('new', 'You do not have permission');
                        if (user == undefined || user.room == undefined) {
                            socket.emit('refresh', 'Connection Broke, Refreshing...');
                        }
                        else {
                            socket.broadcast.to(user.room).emit('new', `${user.name} trying to enter has been blocked.`);
                        }
                    }
                }
            }
            else {
                if (user == undefined || user.room == undefined) {
                    socket.emit('refresh', 'Connection Broke, Refreshing...');
                }
                if (pass == true) {
                    blocked[`${user.name}`] = Date.now();
                    socket.emit('refresh', 'Too frequent Request, please try after 5 seconds');
                    // socket.broadcast.to(user.room).emit('new', `Some fake inbox message can be there from ${user.name}.`);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', async () => {
        try {
            const user = userLeave(socket.id);
            // console.log('on disconnect', user);
            if (user != undefined) {
                socket.broadcast.to(user.room).emit('check', `${user.name} has left`);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    socket.on('activeYes', async (msg) => {
    })
});

app.get("*", (req, res) => {
    res.status(404).render('error', { "error": `Page not found` });
});

http.listen(port, () => {
    console.log('connection succesful');
});