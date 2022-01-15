const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');
const IdData=require('../schema/idSchemaModal');
const idSchema=require('../schema/idSchema');    

const post_question = async (stri, quest, username,res,req) => {
    
    //check if routed id present or not
    try {
        let user=req.username;
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
                                            res.status(400).send({ "result": "Limit surpassed" });
                                        }
                                    }
                                    else{
                                        res.status(403).send({ "result": "Sorry,You don't have permission." });
                                    }
                                }
                                else{
                                    res.status(400).send({ "result": "All operations are stopped by owner." });
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
                        res.status(400).send({ "result": "Id not found" });
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
module.exports = post_question;