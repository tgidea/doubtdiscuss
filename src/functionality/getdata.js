const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');
const IdData = require('../schema/idSchemaModal');
const idSchema = require('../schema/idSchema');

const getdata = async (stri, res, req) => {
    try {
        const user = req.username;
        mongoose.connection.db.listCollections({ name: stri })
            .next(async (err, info) => {
                //if present:
                if (info) {
                    // if server is running continuously without restating ever
                    var Temp;
                    try {
                        Temp = mongoose.model(stri);
                    }
                    catch (err) {
                        Temp = mongoose.model(stri, expschema2);
                    }
                    try {
                        const result = await Temp.find();
                        const details = await IdData.findOne({ name: stri });
                        if (details.active) {
                            if (details.deniedTo.indexOf(user) == -1) {
                                res.status(200).send({ "result": "success", "alldata": result });
                            }
                            else {
                                res.status(403).send({ "result": "Sorry,You don't have permission." });
                            }
                        }
                        else {
                            res.status(400).send({ "result": "All operations are stopped by owner." });
                        }
                    }
                    catch (err) {
                        console.log(err);
                        res.status(400).send({ "result": "Error occur" });
                    }
                }
                else {
                    // console.log('id not match');
                    res.status(400).send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": "Error occured" });
    }
}
module.exports = getdata;