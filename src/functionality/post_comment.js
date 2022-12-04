const mongoose = require('mongoose');
const IdData = require('../schema/idSchemaModal');
const idSchema = require('../schema/idSchema');
const QuesModel = require('../schema/quesModel');

const post_comment = async (id, quesId, comment, req, res) => {

    //check if routed id present or not
    try {
        let username = req.username;
        try {
            const Temp=await QuesModel.findOne({_id:quesId});
            if(Temp){
                let com=Temp.comment;
                const obj={
                    "author":username,
                    "text":comment
                }
                com.push(obj);
                QuesModel.updateOne({ _id: quesId },
                    { $set: { comment: com } })
                    .then(function (data) {
                        res.status(200).send({"result":"success","comment":com});
                    })
                    .catch(function (err) {
                        console.log('err in comment',err);
                        res.status(500).send({"result":"some error occur"});
                    })
            }
            else{
                res.status(400).send({"result":"Question Id not found. Either it's deleted or something gone wrong"});
            }
        }
        catch (err) {
            console.log(err,'in post_comment');
            res.status(400).send({ "result": "Question Id not found" });
        }
    }
    catch (err) {
        console.log(err,'in post_comment');
        res.status(400).send({ "result": "Error occured" });
    }
}
module.exports = post_comment;