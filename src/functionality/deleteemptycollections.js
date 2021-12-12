const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');

const getmillsec = function () {
    var d = new Date();
    return d.getTime();
}
const deleteBlankCollection = async (res) => {
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
                                const Temp = mongoose.model(naam, expschema2);
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
}
module.exports=deleteBlankCollection;