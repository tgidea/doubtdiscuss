const mongoose = require('mongoose')
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path')
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
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
const deleteDocument=require('./functionality/deleteDocument');
const post_question = require('./functionality/post_question');
const getdata = require('./functionality/getdata');
const create_update_ip = require('./functionality/create_update_userkeyid');
const changeOption = require('./functionality/changeoption');
const deleteCollection = require('./functionality/deleteColl');
const deleteBlankCollection = require('./functionality/deleteemptycollections');
const createLength = require('./functionality/generateid');
const Register = require('./registerSchema');
const authlogout = require('./middleware/authlogout');
require('dotenv').config({ path: __dirname + '/config.env' });
const JWT_KEY = process.env.JWT_TOKEN;

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 9001;
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

})

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
        const username = req.body.username.toLowerCase();
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (username == "" || name == "" || email == "" || password.length < 5 || name.length < 2) {
            return res.json({ "result": "Please fill carefully" });
        }
        const createDocument = async () => {
            const userinfor = new Register({
                "username": username,
                "name": name,
                "email": email,
                "password": password,
                "confirmPassword": confirmPassword,
            });
            try {
                const token = await userinfor.generateAuthToken();
                const result = await userinfor.save();
                // res.sendFile(path.join(staticPath, 'main.html'));
                return "success";
            }
            catch (err) {
                console.log('error in /register');
                if (err.code == 11000) {
                    if (err.keyValue.username != undefined) {
                        res.send({ "result": "Username already registered" });
                    }
                    else if (err.keyValue.email != undefined) {
                        res.send({ "result": "Email already registered. Please sign in" });
                    }
                }
                else {
                    res.send({ "result": "Please fill carefully" });
                }
                return "fail";
            }
        }
        if (password === confirmPassword) {
            const response = await createDocument();
            if (response == "success") {
                res.redirect('/');
            }
        }
        else {
            res.send({ "result": "Password not match" });
        }

    }
    catch (err) {
        console.log(err);
        console.log('Error in processing /register');
        res.send({ "result": "Something went wrong" });
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
        res.send({ "result": "Invalid login details" });
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
        create_update_ip(str1, username, res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
});
app.get('/post/:uniq_id/:quest', auth, async (req, res) => {
    try {
        const stri = "" + req.params.uniq_id;
        const usernam = req.username;
        const quest = req.params.quest.toString();
        //check if routed id present or not
        post_question(stri, quest, usernam, res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
});

app.get('/get/:id', auth, async (req, res) => {
    try {
        const stri = "" + req.params.id;
        await getdata(stri, res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
});


app.get('/change/:coll_id/:quest_id/:opt/:status', auth, async (req, res) => {
    try {
        const stri = "" + req.params.coll_id;
        const questid = "" + req.params.quest_id;
        const opti = "" + req.params.opt;
        const status = "" + req.params.status;
        changeOption(stri, questid, opti, status, res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
});

app.get('/delete/:id', auth, async (req, res) => {
    try {
        const stri = "" + req.params.id;
        deleteCollection(stri, res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
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
        res.send({ "result": "Something went wrong" });
    }
})

app.get('/deleteblankcollections/', async (req, res) => {
    try {
        deleteBlankCollection(res);
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
});

app.get("*", (req, res) => {
    res.send(`<h2>Page not found</h2>`);
});

app.listen(port, () => {
    console.log('connection succesful');
});