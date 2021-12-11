const mongoose = require('mongoose')
const express = require('express');
const bodyparser = require('body-parser');
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
const deleteCollection = require('./deleteColl');
const deleteBlankCollection = require('./deleteemptycollections');
const createLength = require('./generateid');
const Register = require('./registerSchema');
require('dotenv').config({ path: __dirname + '/config.env' });
const JWT_KEY=process.env.JWT_TOKEN;

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 9001;
// mongodb://localhost:27017/expapp


const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    console.log(staticPath);
    res.sendFile(path.join(staticPath, 'index.html'));
});

app.get('/pag/:id', (req, res) => {
    const id = req.params.id.toString();
    res.status(201).render('page', { name: id });
});

app.get('/pag/', (req, res) => {
    res.status(201).render('page', { name: "" });
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
        console.log('Error in processing /register');
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
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            })
                // res.status(201).sendFile(path.join(staticPath, 'main.html'));
                .redirect('main.html')
        }
        else {
            res.send({ "result": "Invalid login details" });
        }
    }
    catch (err) {
        console.log('Error occur in /login');
        res.send({ "result": "Invalid login details" });
    }
})

app.get('/newkey/', async (req, res) => {
    var str1 = await createLength();
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


app.get('/change/:coll_id/:quest_id/:opt/:status', async(req, res) => {
    try{
        const stri = "" + req.params.coll_id;
        const questid = "" + req.params.quest_id;
        const opti = "" + req.params.opt;
        const status=""+ req.params.status;
        changeOption(stri, questid, opti,status, res);
    }
    catch(err){
        console.log(err);
    }
});

app.get('/delete/:id', async (req, res) => {
    const stri = "" + req.params.id;
    deleteCollection(stri, res);
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