const mongoose = require('mongoose');
const expschema2 = require('./expschema2');

const changeOption = async (stri, questid, opti, status, res) => {

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
                        if (status == "inc") {
                            const result = await Temp.updateOne({ _id: questid }, {
                                $inc: { [`${opti}`]: 1 }
                            })
                        }
                        else{
                            const result = await Temp.updateOne({ _id: questid }, {
                                $inc: { [`${opti}`]: -1 }
                            })
                        }
                        const check=await Temp.find({_id:questid});
                        if(check[0][`${opti}`]<0){
                            const result=await Temp.updateOne({_id:questid},{
                                $set:{[`${opti}`]:0}
                            })
                        }
                        res.send({ "result": "Success" });
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
module.exports = changeOption;