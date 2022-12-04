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
const profileAuth=require('./middleware/profileauth');
const blockReq = require('./schema/blockReqschema');
const expschema2 = require('./schema/expschema2');
const Client = require('./schema/usernewkey');
const conn = require('./databaseconn');
const editId=require('./functionality/editId');
const IdData=require('./schema/idSchemaModal');
const idSchema=require('./schema/idSchema');
const deleteDocument=require('./functionality/deleteDocument');
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

app.get('/' ,(req, res) => {
    try{
        const token=req.cookies.jwt;
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        res.redirect('/main');
    }
    catch(err){
        try{
            res.sendFile(path.join(staticPath, 'login.html'));
        }
        catch(error){
            res.send("Something went wrong");
        }
    }
});

app.get('/main', authstart, async (req, res) => {
    try {
        const username = req.username;
        res.status(201).render('main', { username: username,link:"/profile" });
    }
    catch (err) {
        console.log('Invalid token');
        res.status(201).render('main', { username: "Login",link:"/" });
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

app.get('/profile',profileAuth,async(req,res)=>{
    try{
        const username=req.username;
        const name=req.name;
        const email=req.email;
        const ids=req.ids;
        res.status(201).render('profile',{username,name,email,ids});
    }
    catch(err){
        console.log(err);
        res.send({status:"error",result:"Something went wrong"});
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
        if (req.body.email == undefined || req.body.password == undefined) {
            res.send({ "result": "Invalid login details" });
        }
        const email = req.body.email;
        const password = req.body.password.toString();
        //const Temp = Register.find({"email":email}) or 
        const Temp = await Register.find({ "email": email })
        if (Temp[0] == undefined) {
            res.send({ "result": "Invalid login details" });
        }
        else if (Temp[0].password == password) {
            const token = await Temp[0].generateAuthToken();
            // console.log(token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 32400000000),
                httpOnly: true
            })
                // res.status(201).sendFile(path.join(staticPath, 'main.html'));
                .redirect('/main')
        }
        else {
            res.send({ "result": "Invalid login details" });
        }
    }
    catch (err) {
        console.log('Error occur in /login');
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
})

app.get('/logout',authlogout,async(req,res)=>{
    try{
        res.clearCookie('jwt');
        const temp=await req.user.save();
        res.sendFile(path.join(staticPath, 'login.html'));
    }
    catch(err){
        res.status(500).send(`<h1>Logout fails</h1>`);
    }
})

app.get('/newkey/', auth, async (req, res) => {
    try {
        var str1 = await createLength();
        const username = req.username;
        create_update_ip(str1, username, res,req);
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
        const stri = "" + req.params.uniq_id;
        const usernam = req.username;
        const quest = req.params.quest.toString();
        //check if routed id present or not
        post_question(stri, quest, usernam, res,req);
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
        await getdata(stri, res,req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/edit/:idName/:fun/:event/',profileAuth,(req,res)=>{
    try{
        const idName=req.params.idName;
        const fun=req.params.fun;
        const event=req.params.event;
        if(req.ids.indexOf(idName)>-1){
            editId(res,req,idName,fun,event);
        }
        else{
            res.send({"result":"Please Contact Owner"});
        }
    }
    catch(err){
        console.log(err);
        res.send({"result":"Something went wrong"});
    }
})

app.get('/change/:coll_id/:quest_id/:opt/:status', auth, async (req, res) => {
    try {
        const stri = "" + req.params.coll_id;
        const questid = "" + req.params.quest_id;
        const opti = "" + req.params.opt;
        const status = "" + req.params.status;
        changeOption(stri, questid, opti, status, res,req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/delete/:id', auth, async (req, res) => {
    try {
        const stri = "" + req.params.id;
        deleteCollection(stri, res,req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

app.get('/deleteDocument/:collection/:document',auth,async(req,res)=>{
    try {
        const collection = "" + req.params.collection;
        const document=req.params.document;
        const username=req.username;
        deleteDocument(req, res,collection,document,username);
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
            if (blocked[`${user.name}`] == undefined || (Date.now() - blocked[`${user.name}`]) > 2000) {
                pass = true;
            }
            // console.log(pass);
            if (limitId(socket.id) && pass) {
                if (msg.message == 'Question deleted' || msg.message == 'option change' || msg.message == 'question post' || msg.message == 'All quesiton deleted') {
                    const status = await IdData.findOne({ name: `${user.room}` });
                    
                    if (status.deniedTo.toString().indexOf(`${user.name}`) < 0) {
                        if (user != undefined && user.room != undefined ){
                            if(msg.data.length>0 && msg.message == 'option change'){                                
                                socket.broadcast.to(user.room).emit('optionChange',
                                {
                                    // "message": `${msg.data}  ${msg.message} by ${user.name}`,
                                    "message": `${msg.message} by ${user.name}`,
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