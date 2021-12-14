const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');

const deleteCollection = async (stri, res) => {
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
                                if (number > 59) {
                                    await Temp.deleteMany();
                                    console.log('deleted successfully');
                                    res.send({ "result": "success" });
                                }
                                else {
                                    res.send({ "result": "Can't delete till a limit reach" });
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
module.exports=deleteCollection;