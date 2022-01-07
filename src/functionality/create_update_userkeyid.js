const mongoose = require('mongoose');
const Client = require('../schema/usernewkey');
const blockReq = require('../schema/blockReqschema');
const dynamicSchema = require('../schema/dynamicCollection');
const IdData=require('../schema/idSchemaModal');
const idSchema=require('../schema/idSchema');

const createIpDoc = async (id, username) => {
    try {
        const datacoll = new Client({
            "username": username,
            "id": id,
            "count": 1
        });
        const result = await datacoll.save();

    }
    catch (err) {
        console.log(err);
    }
}
const createIdEdit=async(_id,author)=>{
    console.log('here in create id edit');
    try{
        const idModal=new IdData({
            "name":_id,
            "author":author
        });
        const result=await idModal.save();
    }
    catch(err){

    }
}

const create_update_ip = async (str1, username, res,req) => {
    // console.log(str1);
    try {
        const fun = async () => {
            var Temp;
            //try for usergernewkeupdates
            try {
                Temp = mongoose.model("user1ids");
            }
            catch (err) {
                Temp = mongoose.model(`user1ids`, blockReq);
            }
            try {
                const result = await Temp.find({ "username": username });
                // user found
                // console.log(result);
                if (result != null && result != undefined &&result.length>0 ) {
                    //if ids request exceed 2
                    if (result[0].count >= 2) {
                        // console.log(2);
                        res.send({ "result": `success`, "id": ` ${result[0].id}` });
                    }
                    // ids request not exceed 2
                    else {
                        try {
                            //try for updates if count<2
                            // console.log(1);
                            const idtemp = result[0].id + " " + str1;
                            const idcount = result[0].count + 1;
                            dynamicSchema(str1);
                            createIdEdit(str1,username);
                            try {
                                Temp.updateOne({ username: username },
                                    { $inc: { count: 1 } }).then(function () {
                                    }).catch(function (err) {
                                        console.log(err);
                                    })
                                Temp.updateOne({ username: username },
                                    { $set: { id: idtemp } }).then(function () {
                                    }).catch(function (err) {
                                        console.log(err);
                                    })
                                const obj = { "result": "success", "id": `${result[0].id} ${str1}` };
                                // console.log(obj);
                                res.send(obj);

                            }
                            catch (err) {
                                console.log('err occured', err);
                                res.status(200).send({ "result": "update Unsuccessful" })
                            }
                        }
                        catch (err) {
                            console.log(err);
                            res.status(400).send({ "result": `Error occured ` });
                        }
                    }
                }
                //username not found
                else {
                    createIpDoc(str1, username);
                    dynamicSchema(str1);
                    createIdEdit(str1,username);
                    const obj = { "result": "success", "id": str1 };
                    res.send(obj);
                }
            }
            catch (err) {
                console.log(err);
                console.log('username not found ');
                res.status(400).send({ "result": "Something went wrong" });
            }
        }
        fun();
    }
    catch (err) {
        // console.log('id not match');
        res.status(400).send({ "result": "Id not found" });
    }
}
module.exports = create_update_ip;