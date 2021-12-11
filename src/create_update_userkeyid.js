const mongoose = require('mongoose');
const Client = require('./usernewkey');
const dynamicSchema = require('./dynamicCollection');
const blockReq=require('./blockReqschema');

const createIpDoc = async (id, ip) => {
    try {
        const datacoll = new Client({
            "ip": ip,
            "id": id,
            "count": 1
        });
        const result = await datacoll.save();

    }
    catch (err) {
        console.log(err);
    }
}

const create_update_ip = async (str1, userip, res) => {

    try {
        const fun = async () => {
            var Temp;
            //try for usergernewkeupdates
            try {
                Temp = mongoose.model("usergetnewkeydatas");
            }
            catch (err) {
                Temp = mongoose.model(`usergetnewkeydatas`, blockReq);
            }
            try {
                const result = await Temp.find({ ip: `${userip}` });
                //ip found
                if (result.length > 0) {
                    console.log('ip find');
                    //if ids request exceed 2
                    if (result[0].count >= 2) {
                        // res.send({ "result": `<strong>Sorry</strong>,No more ids for you.<br> Your previous ids are ${result[0].id}`, "id": ` ${result[0].id}` });
                        res.send({ "result":"success", "id": ` ${result[0].id}` });
                    }
                    //ids request not exceed 2
                    else {
                        try {
                            //try for updates if count<2
                            const idtemp = result[0].id + " " + str1;
                            const idcount = result[0].count + 1;
                            dynamicSchema(str1);
                            try {
                                Temp.updateOne({ ip: userip },
                                    { $inc: { count: 1 } }).then(function () {
                                    }).catch(function (err) {
                                        console.log(err);
                                    })
                                Temp.updateOne({ ip: userip },
                                    { $set: { id: idtemp } }).then(function () {
                                    }).catch(function (err) {
                                        console.log(err);
                                    })
                                const obj = { "result": "success", "id": `${result[0].id}  ${str1}` };
                                // console.log(obj);
                                res.send(obj);

                            }
                            catch (err) {
                                console.log('err occured', err);
                                res.send({ "result": "update unsuccessful due to error"})
                            }

                        }
                        catch (err) {
                            console.log(err);
                            res.send({ "result": `Error occured ` });
                        }
                    }
                }
                //ip not found
                else {
                    createIpDoc(str1, userip);
                    dynamicSchema(str1);
                    const obj = { "result": "success", "id": str1 };
                    res.send(obj);
                }
            }
            catch (err) {
                console.log(err);
                console.log('ip not found ');
                res.send({ "result": "Error"});
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