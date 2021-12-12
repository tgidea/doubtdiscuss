const mongoose = require('mongoose');
const Client = require('../schema/usernewkey');
const dynamicSchema = require('../schema/dynamicCollection');
const blockReq = require('../schema/blockReqschema');

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

const create_update_ip = async (str1, username, res) => {
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
                if (result != null && result != undefined &&result.length>0 ) {
                    //if ids request exceed 2
                    if (result[0].count >= 2) {
                        res.send({ "result": `<strong>Sorry</strong>,No more ids for you.<br> Your previous ids are ${result[0].id}`, "id": ` ${result[0].id}` });
                        res.send({ "result": "success", "id": ` ${result[0].id}` });
                    }
                    // ids request not exceed 2
                    else {
                        try {
                            //try for updates if count<2
                            const idtemp = result[0].id + " " + str1;
                            const idcount = result[0].count + 1;
                            dynamicSchema(str1);
                            try {
                                Temp.updateOne({ username: username },
                                    { $inc: { count: 1 } }).then(function () {
                                    }).catch(function (err) {
                                        console.log(err);
                                    })
                                Temp.updateOne({ ip: username },
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
                                res.send({ "result": "update Unsuccessful" })
                            }
                        }
                        catch (err) {
                            console.log(err);
                            res.send({ "result": `Error occured ` });
                        }
                    }
                }
                //username not found
                else {
                    createIpDoc(str1, username);
                    dynamicSchema(str1);
                    const obj = { "result": "success", "id": str1 };
                    res.send(obj);
                }
            }
            catch (err) {
                console.log(err);
                console.log('username not found ');
                res.send({ "result": "Something misterios happened" });
            }
        }
        fun();
    }
    catch (err) {
        // console.log('id not match');
        res.send({ "result": "Id not found" });
    }
}
module.exports = create_update_ip;