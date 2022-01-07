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
const profileAuth = require('./middleware/profileauth');
const nodemailer = require('nodemailer');
const transporter = require('./functionality/nodemailer');
const blockReq = require('./schema/blockReqschema');
const expschema2 = require('./schema/expschema2');
const Client = require('./schema/usernewkey');
const conn = require('./databaseconn');
const editId = require('./functionality/editId');
const IdData = require('./schema/idSchemaModal');
const idSchema = require('./schema/idSchema');
const deleteDocument = require('./functionality/deleteDocument');
const post_question = require('./functionality/post_question');
const getdata = require('./functionality/getdata');
const create_update_ip = require('./functionality/create_update_userkeyid');
const changeOption = require('./functionality/changeoption');
const deleteCollection = require('./functionality/deleteColl');
const deleteBlankCollection = require('./functionality/deleteemptycollections');
const createLength = require('./functionality/generateid');
const loginFun = require('./functionality/login');
const Register = require('./registerSchema');
const registerFun = require('./functionality/registerFun');
const authlogout = require('./middleware/authlogout');
require('dotenv').config({ path: __dirname + '/config.env' });
const pass = process.env.PASS;
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

app.get('/', (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.JWT_TOKEN);
        res.redirect('/main');
    }
    catch (err) {
        try {
            res.sendFile(path.join(staticPath, 'login.html'));
        }
        catch (error) {
            res.status(400).send("Something went wrong");
        }
    }
});


app.get('/main', authstart, async (req, res) => {
    try {
        const username = req.username;
        res.status(201).render('main', { username: username, link: "/profile" });
    }
    catch (err) {
        console.log('Invalid token');
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
        res.status(400).render('error',{"error":`Something went wrong`});
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
        res.status(400).render('error',{"error":`Logout fails`});
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
app.get('/post/:uniq_id/:quest', auth, async (req, res) => {
    try {
        const stri = "" + req.params.uniq_id;
        const usernam = req.username;
        const quest = req.params.quest.toString();
        //check if routed id present or not
        post_question(stri, quest, usernam, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Something went wrong" });
    }
});

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
            res.status(404).render('error',{"error":`Page not found`});
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).render('error',{"error":`Something went wrong`});
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
            res.status(400).render('error',{"error":`Please contact owner`});
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).render('error',{"error":`Something went wrong`});
    }
})
app.get('/outverify', async (req, res) => {
    try {
        const mail = req.query.email;
        const username = req.query.username;
        const details = await Register.findOne({ email: mail });
        if (details) {
            if (details.username == username) {
                const id = details._id;
                const name = details.username;
                var mailOptions = {
                    from: 'gyanexplode@gmail.com',
                    to: `${mail}`,
                    subject: 'Verify Account',
                    html: `<h1>Welcome ${name}</h1><h4> Thanks for choosing doubtHelper</h4>
                        <p>Please link <a href="https://doubthelpertester.herokuapp.com/verify?id=${id}&name=${name} ">here</a> to verify your email.</p>
                        `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(400).send({ "result": "Something wrong happened" })
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(201).render('success',{"text":`Verification email has been sent`});
                    }
                });
            }
            else{
                throw('Not valid (in outverify)');
            }
        }
        else {
            res.status(400).render('error',{"error":` username or email are not matching`});
            
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).render('error',{"error":` username or email are not matching`});
    }
})
app.get('/verify/', async (req, res) => {
    try {
        const _id = req.query.id.toString();
        const username = req.query.name.toString();
        const details = await Register.findOne({ _id: _id });
        if (details.username == username) {
            const result = await Register.updateOne({ _id },
                {
                    $set: {
                        active: true
                    }
                });
            if (result) {
                res.status(201).render('success',{"text":`Your email has been verified succesfully`});
            }
            else {
                res.status(400).render('error',{"error":`Something went wrong`});
            }
        }
        else {
            res.status(400).render('error',{"error":`Invalid`});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).render('error',{"error":`Invalid`});
    }
})

app.get('/change/:coll_id/:quest_id/:opt/:status', auth, async (req, res) => {
    try {
        const stri = "" + req.params.coll_id;
        const questid = "" + req.params.quest_id;
        const opti = "" + req.params.opt;
        const status = "" + req.params.status;
        changeOption(stri, questid, opti, status, res, req);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "result": "Something went wrong" });
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
        res.status(400).render('error',{"error":`Something went wrong`});
    }
});

app.get("*", (req, res) => {
    res.status(404).render('error',{"error":`Page not found`});
});

app.listen(port, () => {
    console.log('connection succesful');
});