const mongoose = require('mongoose')
const express = require('express');
const path = require('path')

const dotenv = require('dotenv');
const { clearScreenDown } = require('readline');
const app = express();
const port = process.env.PORT || 8000;
// mongodb://localhost:27017/expapp
require('dotenv').config({ path: __dirname + '/config.env' });

var check = 0;
const url2 = process.env.DATABASE;
const conn = mongoose.connect(url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('success connection'))
    .catch((err) => console.log(err))



const getmillsec = function () {
    var d = new Date();
    return d.getTime();
}

// *****************************************************
const blockReq = new mongoose.Schema({
    ip: String,
    id: String,
    count: Number,
    data: {
        type: Date,
        default: Date.now
    }
});
const Client = mongoose.model('usergetnewkeydatas', blockReq);

const expSchema2 = new mongoose.Schema({
    title: String,
    title: String,
    opt1: {
        type: Number,
        default: 0
    },
    opt2: {
        type: Number,
        default: 0
    },
    opt3: {
        type: Number,
        default: 0
    },
    opt4: {
        type: Number,
        default: 0
    }
});

//create dynamically collections
function dynamicSchema(prefix) {
    const expSchema = new mongoose.Schema({
        title: String,
        opt1: {
            type: Number,
            default: 0
        },
        opt2: {
            type: Number,
            default: 0
        },
        opt3: {
            type: Number,
            default: 0
        },
        opt4: {
            type: Number,
            default: 0
        }

    });
    mongoose.model(prefix + "", expSchema, prefix);
    // console.log('reach here')
    return;
}
// **********************************************************************************
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
    // res.send('hello first page here');
});

// **********************************************************************************
const Clienttemp = mongoose.model('usergetnewkeydatas');
const createIpDoc = async (id, ip) => {
    try {
        const datacoll = new Client({
            "ip": ip,
            "id": id,
            "count": 1
        });
        const result = await datacoll.save();

    }
    catch (err) {
        console.log(err);
    }
}
// route for creating new id
const getip = async (req) => {
    var ip="header------  ";
    if (req.headers['x-forwarded-for']) {
        ip += req.headers['x-forwarded-for'];
    } if (req.connection && req.connection.remoteAddress) {
        ip = ip +"  req.connection------  "+ req.connection.remoteAddress;
        ip = ip +"  req.socket.remote------  "+ req.socket.remoteAddress;
        ip = ip +"  req.bdevala------  "+ req.connection.socket.remoteAddress.split(",")[0];

    }
        ip = ip+" req.ip is-----   "+ req.ip;
    console.log(ip)
    return ip;
}
app.get('/newkey/:uni_id', async (req, res) => {

    var str1 = "" + req.params.uni_id;
    const userip = await getip(req);
    // const userip = "" + req.ip;
    try {
        mongoose.connection.db.listCollections({ name: `usergetnewkeydatas` })
            .next(function (err, info) {
                if (info) {
                    try {
                        const fun = async () => {
                            try {
                                //try for usergernewkeupdates
                                const Temp = mongoose.model(`usergetnewkeydatas`);
                                try {

                                    const result = await Temp.find({ ip: `${userip}` });
                                    // console.log(result);
                                    //ip found
                                    if (result.length > 0) {
                                        // console.log('second hit');
                                        //if ids request exceed 5
                                        if (result[0].count >= 2) {
                                            res.send({ "result": `<strong>Sorry</strong>,No more ids for you.<br> Your previous ids are ${result[0].id}`, "id": ` ${result[0].id}` });
                                        }
                                        //ids request not exceed 5
                                        else {
                                            try {
                                                //try for updates if count<2
                                                // console.log(result[0].id);
                                                const idtemp = result[0].id + " " + str1;
                                                // console.log(result[0].count);
                                                const idcount = result[0].count + 1;
                                                dynamicSchema(str1);
                                                try {
                                                    Temp.updateOne({ ip: userip },
                                                        { $inc: { count: 1 } }).then(function () {
                                                            // console.log('update success');
                                                        }).catch(function (err) {
                                                            console.log(err);
                                                        })
                                                    Temp.updateOne({ ip: userip },
                                                        { $set: { id: idtemp } }).then(function () {
                                                            // console.log('update success');
                                                        }).catch(function (err) {
                                                            console.log(err);
                                                        })
                                                    // console.log(update);
                                                    const obj = { "result": "success", "id": `${result[0].id}  ${str1}` };
                                                    res.send(obj);
                                                }
                                                catch (err) {
                                                    console.log('err occured', err);
                                                }

                                            }
                                            catch (err) {
                                                console.log('hereeeee');
                                                console.log(err);
                                                res.send({ "result": `${err}` });
                                            }
                                        }
                                    }
                                    //ip not found
                                    else {
                                        // console.log('first hit');
                                        createIpDoc(str1, userip);
                                        dynamicSchema(str1);
                                        const obj = { "result": "success", "id": str1 };
                                        res.send(obj);
                                    }
                                }
                                catch (err) {
                                    console.log('ip not found ');
                                }

                            }
                            catch (err) {
                                //try for usergernewkeupdates
                                const Temp = mongoose.model(`usergetnewkeydatas`, blockReq);
                                try {

                                    const result = await Temp.find({ ip: `${userip}` });
                                    // console.log(result);
                                    //ip found
                                    if (result.length > 0) {
                                        //if ids request exceed 5
                                        if (result.count > 5) {
                                            res.send({ "result": `<strong>Sorry</strong>,No more ids for you.<br> Your previous ids are ${result[0].id}`, "id": ` ${result[0].id}` });
                                        }
                                        //ids request not exceed 5
                                        else {
                                            try {
                                                //try for updates if count<5
                                                // console.log(result[0].id);
                                                const idtemp = result[0].id + " " + str1;
                                                // console.log(result[0].count);
                                                const idcount = result[0].count + 1;
                                                dynamicSchema(str1);
                                                try {
                                                    Temp.updateOne({ ip: userip },
                                                        { $inc: { count: 1 } }).then(function () {
                                                            // console.log('update success');
                                                        }).catch(function (err) {
                                                            console.log(err);
                                                        })
                                                    // console.log(update);
                                                    const obj = { "result": "success", "id": result[0].id };
                                                    res.send(obj);
                                                }
                                                catch (err) {
                                                    console.log('err occured', err);
                                                }

                                            }
                                            catch (err) {
                                                // console.log('hereeeee');
                                                console.log(err);
                                                res.send({ "result": `${err}` });
                                            }
                                        }
                                    }
                                    //ip not found
                                    else {
                                        createIpDoc(str1, userip);
                                        dynamicSchema(str1);
                                        const obj = { "result": "success", "id": str1 };
                                        res.send(obj);
                                    }
                                }
                                catch (err) {
                                    console.log('ip not found ');
                                }

                            }
                        }
                        fun();

                    }
                    catch (err) {
                        // console.log('id not match');
                        res.send({ "result": "Id not found" });
                    }
                }
                else {
                    console.log('not found')
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
    // }
})


// **********************************************************************************
const staticPath2 = path.join(__dirname, '../public');
app.use(express.static(staticPath2));

// app.set('view engine', "hbs");

app.get('/post/:uniq_id/:quest', async (req, res) => {
    const stri = "" + req.params.uniq_id;
    // console.log('params is  ', req.params);
    const quest = req.params.quest.toString();
    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(function (err, info) {
                //if present:
                if (info && stri.length > 24 && stri.length < 60) {
                    // if server is running continuously without restating ever

                    try {
                        const fun = async () => {
                            try {
                                const Temp = mongoose.model(stri);
                                const number = await Temp.countDocuments();
                                // console.log(number);
                                if (number < 60) {
                                    const createDocument = async () => {
                                        const datacoll = new Temp({
                                            "title": quest
                                        });
                                        const result = await datacoll.save();
                                        // console.log('created successfully');
                                    }
                                    createDocument();
                                    res.send({ "result": "success" });
                                }
                                else {
                                    res.send({ "result": "Can't add more than 60 questions" });
                                }
                            }
                            catch (err) {
                                // if server restarted : to handle previously made collections
                                const Temp = mongoose.model(stri, expSchema2);
                                const number = await Temp.countDocuments();
                                // console.log(number);
                                if (number < 60) {
                                    const createDocument = async () => {
                                        const datacoll = new Temp({
                                            "title": quest
                                        });
                                        const result = await datacoll.save();
                                        // console.log('added successfully');
                                    }
                                    createDocument();
                                    res.send({ "result": "Data added successfully" });
                                }
                                else {
                                    res.send({ "result": "Can't add more than 60 questions" });
                                }
                            }
                        }
                        fun();

                    }
                    catch (err) {
                        // console.log('id not match');
                        res.send({ "result": "Id not found" });
                    }
                }
                else {
                    // console.log('id not match');
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
});


// **************************************************************************

app.get('/get/:id', (req, res) => {
    const stri = "" + req.params.id;
    // console.log('params is  ', req.params);
    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(async (err, info) => {
                //if present:
                if (info) {
                    // if server is running continuously without restating ever
                    try {
                        const Temp = mongoose.model(stri);
                        const result = await Temp.find();
                        // console.log('found successfully');

                        res.send({ "result": "success", "alldata": result });
                    }
                    catch {

                        // if server restarted : to handle previously made collections
                        try {
                            const Temp = mongoose.model(stri, expSchema2);
                            const result = await Temp.find();
                            // console.log('found successfully');
                            res.send({ "result": "success", "alldata": result });
                        }
                        catch (err) {
                            // console.log('id not match');
                            res.send({ "result": "Id not found" });
                        }

                    }
                }
                else {
                    // console.log('id not match');
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
})


// ***************************************************************************
app.get('/change/:coll_id/:quest_id/:opt', (req, res) => {
    const stri = "" + req.params.coll_id;
    const questid = "" + req.params.quest_id;
    const opti = "" + req.params.opt;

    // console.log('params is  ', req.params);
    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(async (err, info) => {
                //if present:
                if (info) {
                    // if server is running continuously without restating ever
                    try {
                        const Temp = mongoose.model(stri);
                        const result = await Temp.updateOne({ _id: questid }, {
                            $inc: { [`${opti}`]: 1 }
                        })

                        // console.log(result);
                        res.send({ "result": "success" });
                    }
                    catch {

                        // if server restarted : to handle previously made collections
                        try {
                            const Temp = mongoose.model(stri);
                            const result = await Temp.find({ _id: questid });

                            // console.log(result);
                            res.send({ "result": "success" });
                        }
                        catch (err) {
                            // console.log('id not match');
                            res.send({ "result": "Id not found" });
                        }

                    }
                }
                else {
                    // console.log('id not match');
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
})
// **********************************************************************

app.get('/delete/:id', async (req, res) => {
    const stri = "" + req.params.id;

    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(function (err, info) {
                //if present:
                if (info && stri.length > 24) {
                    // if server is running continuously without restating ever

                    try {
                        const fun = async () => {
                            try {
                                const Temp = mongoose.model(stri);
                                const number = await Temp.countDocuments();
                                // console.log(number);
                                if (number > 59) {
                                    await Temp.deleteMany();
                                    // const result = await datacoll.save();
                                    console.log('deleted successfully');
                                    res.send({ "result": "success" });
                                }
                                else {
                                    res.send({ "result": "Can't delete till a limit reach" });
                                }
                            }
                            catch (err) {
                                // if server restarted : to handle previously made collections
                                const Temp = mongoose.model(stri, expSchema2);
                                const number = await Temp.countDocuments();

                                // console.log(number);
                                if (number > 59) {
                                    await Temp.deleteMany();
                                    // const result = await datacoll.save();
                                    // console.log('deleted successfully');
                                    res.send({ "result": "success" });
                                }
                                else {
                                    res.send({ "result": "Can't delete till a limit reach" });
                                }
                            }
                        }
                        fun();
                    }
                    catch (err) {
                        // console.log('id not match');
                        res.send({ "result": "Id not found" });
                    }
                }
                else {
                    // console.log('id not match');
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
});


app.get('/deleteblankcollections/', async (req, res) => {
    // const stri = "" + req.params.id;

    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections()
            .toArray(function (err, info) {
                const details = info;
                for (var i = 0; i < details.length; i++) {
                    //     // if server is running continuously without restating ever
                    const naam = "" + details[i].name;
                    var reslt = 'check database';
                    // console.log(naam);
                    try {
                        const fun = async () => {
                            try {
                                const Temp = mongoose.model(naam);
                                const number = await Temp.countDocuments();
                                if (number < 1) {
                                    try {
                                        await mongoose.connection.collection(naam).drop()
                                        userData = [{ ip: "empty now", id: 'empty now', time: getmillsec() }]
                                    }
                                    catch (err) {
                                        reslt = `${err}`;
                                        console.log(err);
                                    }
                                }
                            }
                            catch (err) {

                                // if server restarted : to handle previously made collections
                                reslt = `${err}`;
                                const Temp = mongoose.model(naam, expSchema2);
                                const number = await Temp.countDocuments();
                                if (number < 1) {

                                    try {
                                        await mongoose.connection.collection(naam).drop()
                                        console.log('deleted successfully');
                                    }
                                    catch (err) {
                                        reslt = `${err}`;
                                        console.log(err);
                                    }

                                }
                            }
                        }
                        fun();
                    }
                    catch (err) {
                        reslt = `${err}`;
                    }

                }
                res.send({ "result": reslt });

            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
});




app.get("*", (req, res) => {
    res.send(`<h2>Page not found</h2>`);
});

app.listen(port, () => {
    console.log('connection succesful');
});


