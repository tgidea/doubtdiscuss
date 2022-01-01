const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');
const IdData = require('../schema/idSchemaModal');

const deleteCollection = async (stri, res, req) => {
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(function (err, info) {
                //if present:
                if (info && stri.length > 14) {
                    try {
                        const fun = async () => {
                            var Temp;
                            try {
                                // if server is running continuously without restating ever
                                Temp = mongoose.model(stri);
                            }
                            catch (err) {
                                // if server restarted : to handle previously made collections
                                Temp = mongoose.model(stri, expschema2)
                            }
                            try {
                                const number = await Temp.countDocuments();
                                const limit = await IdData.findOne({ name: stri });
                                if (limit.deniedTo.indexOf(req.username) == -1) {
                                    if (limit.active == true) {
                                        if (number > limit && limit.author == req.username || limit.coauthor.indexOf(req.username)>-1) {
                                            await Temp.deleteMany();
                                            console.log('deleted successfully');
                                            res.send({ "result": "success" });
                                        }
                                        else {
                                            if (number > limit) {
                                                res.send({ "result": "You are not owner/co-owner of this id" });
                                            }
                                            else {
                                                res.send({ "result": "Can't delete till a limit reach" });
                                            }
                                        }
                                    }
                                    else{
                                        res.send({ "result": "All operations are closed by owner" });
                                    }
                                }
                                else {
                                    res.send({ "result": "You don't have permission" });
                                }
                            }
                            catch (err) {
                                console.log(err);
                                res.send({ "result": "Error occur " });
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
}
module.exports = deleteCollection;