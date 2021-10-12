const mongoose = require('mongoose')
const express = require('express');
const path = require('path')
// const hbs = require('hbs')
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 8000;
// mongodb://localhost:27017/expapp

require('dotenv').config({ path: __dirname + '/config.env' });

const url2 = process.env.DATABASE;
const conn = mongoose.connect(url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('success connection'))
    .catch((err) => console.log(err))

// *****************************************************8
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
// route for creating new id
app.get('/newkey/:uni_id', (req, res) => {
    // console.log(req.params.uni_id);
    var str1 = "" + req.params.uni_id;
    if (str1.length > 29) {
        // try {
        // console.log("here only", str1);
        // dynamicSchema(str1);
        // const obj = { "result": "success", "id": str1 };
        // res.send(obj);
        // }
        // catch {
        //     res.send({ "result": "No more id possible" })
        // }
        res.send({ "result": "Sorry,this is not production version.You need to contact us to get new ids" });
    }
    else {
        const obj3 = { "result": "failure" }
        res.send(obj3);
    }


});
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
                if (info && stri.length > 24) {
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

app.get("*",(req,res)=>{
    res.send(`<h2>Page not found</h2>`);
});

app.listen(port, () => {
    console.log('connection succesful');
});


