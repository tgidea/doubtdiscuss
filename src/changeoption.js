const mongoose = require('mongoose');
const expschema2 = require('./expschema2');

const changeOption = async (stri,questid , opti,res) => {

    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(async (err, info) => {
                //if present:
                if (info) {
                    var Temp;
                    try {
                        // if server is running continuously without restating ever
                        Temp = mongoose.model(stri);
                    }
                    catch (err) {
                        // if server restarted : to handle previously made collections
                        Temp = mongoose.model(stri, expschema2);
                    }
                    try {
                        const result = await Temp.updateOne({ _id: questid }, {
                            $inc: { [`${opti}`]: 1 }
                        })
                        res.send({ "result": "success" });
                    }
                    catch (err) {
                        console.log(err);
                        res.send({ "result": "Error occur option not updated" })
                    }
                }
                else {
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
}
module.exports=changeOption;