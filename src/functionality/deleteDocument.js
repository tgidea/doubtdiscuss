const mongoose = require('mongoose');
const expschema2 = require('../schema/expschema2');
const IdData = require('../schema/idSchemaModal');

const deleteDocument = async (req, res, collection, document,username) => {

    try {
        mongoose.connection.db.listCollections({ name: collection })
            .next(async (err, info) => {
                //if present:
                if (info) {
                    var Temp;
                    try {
                        // if server is running continuously without restating ever
                        Temp = mongoose.model(collection);
                    }
                    catch (err) {
                        // if server restarted : to handle previously made collections
                        Temp = mongoose.model(collection, expschema2);
                    }
                    try {
                        const result = await Temp.findOne({ _id: document });
                        const status = await IdData.findOne({ name: collection });
                        if(status.active){
                            if(result.owner==username){
                                const deleted=await Temp.deleteOne({_id:document});
                                res.send({ "result": "Success" });
                            }
                            else{
                                res.send({ "result": "You didn't post it." })
                            }
                        }
                        else{
                            res.send({"result":"This ids operation are closed by owner"})
                        }
                    }
                    catch (err) {
                        console.log(err);
                        res.send({ "result": "Something went wrong" })
                    }
                }
                else {
                    res.send({ "result": "Something went wrong" })
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Something went wrong" });
    }
}
module.exports = deleteDocument;