const mongoose = require('mongoose');
const expschema2 = require('./expschema2');

const getdata = async (stri, res) => {
    try {
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
                        res.send({ "result": "success", "alldata": result });
                    }
                    catch (err) {
                        console.log(err);
                        res.send({ "result": "Error occur" });
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
module.exports=getdata;