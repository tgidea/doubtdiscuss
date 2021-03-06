const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');
const IdData=require('../schema/idSchemaModal');
const idSchema=require('../schema/idSchema');    

const post_question = async (stri, quest, username,res,req) => {
    const user=req.username;
    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(function (err, info) {
                //if present:
                if (info && stri.length > 10 && stri.length < 60) {
                    try {
                        const fun = async () => {
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
                                const number = await Temp.countDocuments();
                                const details=await IdData.findOne({name:stri});
                                if(details.active){                                    
                                    if(details.deniedTo.indexOf(user)==-1){
                                        if (number<details.limit) {
                                            const createDocument = async () => {
                                                const datacoll = new Temp({
                                                    "title": quest,
                                                    "owner":username,
                                                });
                                                const result = await datacoll.save();
                                                // console.log('created successfully');
                                            }
                                            createDocument();
                                            res.send({ "result": "success" });
                                        }
                                        else {
                                            res.send({ "result": "Limit surpassed" });
                                        }
                                    }
                                    else{
                                        res.send({ "result": "Sorry,You don't have permission." });
                                    }
                                }
                                else{
                                    res.send({ "result": "All operations are stopped by owner." });
                                }
                            }
                            catch (err) {
                                console.log(err);
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
module.exports = post_question;