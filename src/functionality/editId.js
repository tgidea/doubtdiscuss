const mongoose = require('mongoose');
const IdData = require('../schema/idSchemaModal');
const idSchema = require('../schema/idSchema');

const editId = async (res, req, idName, fun, event) => {
    try {
        const result = await IdData.findOne({ name: idName });
        if (result) {
            if (fun == "limit") {
                if (event > 200) {
                    event = 200;
                }
                if (event < 0) {
                    event = 1;
                }
                try {
                    const limit = await IdData.updateOne({ name: idName },
                        { $set: { limit: event } });
                    res.status(200).send({ "result": "Successfully changed" });
                }
                catch (err) {
                    res.status(400).send({ "result": "Error in updating Limit" });
                }
            }
            else if (fun == "deniedTo") {
                try {
                    let recent = result.deniedTo;
                    if (recent.indexOf(` ${event} `) > -1) {
                        // console.log(recent);
                        recent = recent.replace(` ${event} `, "");
                        event = "";
                    }
                    if (recent == "") {
                        recent = " ";
                    }
                    const denied = await IdData.updateOne({ name: idName }, {
                        $set: {
                            "deniedTo": ` ${recent} ${event} `
                        }
                    })
                    res.status(200).send({ "result": "Done" });
                }
                catch (err) {
                    res.status(400).send({ "result": "Error in updating denied To" });
                }
            }
            else if (fun == "active") {
                try {
                    const recent = result.active;
                    let change = true;
                    if (recent == true) {
                        change = false;
                    }
                    const active = await IdData.updateOne({ name: idName }, {
                        $set: {
                            "active": change
                        }
                    })
                    // console.log('reach hrere');
                    res.status(200).send({ "result": "Successfully updated" });
                }
                catch (err) {
                    res.status(200).send({ "result": "Error in updating active state" });
                }
            }
            else if (fun == "coAuthor") {
                // if (result.author == req.username) {
                    try {
                        let recent = result.coAuthor;
                        if (recent.indexOf(` ${event} `) > -1) {
                            // console.log(recent);
                            recent = recent.replace(` ${event} `, "");
                            event = "";
                        }
                        if (recent == "") {
                            recent = " ";
                        }
                        const denied = await IdData.updateOne({ name: idName }, {
                            $set: {
                                "coAuthor": ` ${recent} ${event} `
                            }
                        })
                        res.status(200).send({ "result": "Done" });
                    }
                    catch (err) {
                        res.status(400).send({ "result": "Error in updating coauthor" });
                    }
                // }
                // else{
                    // res.send({"result":"Only owner can change co-owner"});
                // }
            }
            else {
                res.status(400).send({ "result": "Invalid Demand" });
            }
        }
        else {
            res.status(400).send({ "result": "Id not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ "result": err });
    }
}
module.exports = editId;