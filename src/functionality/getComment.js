const mongoose = require('mongoose');
const IdData = require('../schema/idSchemaModal');
const idSchema = require('../schema/idSchema');
const QuesModel = require('../schema/quesModel');

const get_comment = async (id, quesId,req, res) => {

    //check if routed id present or not
    try {
        let username = req.username;
        try {
            const Temp=await QuesModel.findOne({_id:quesId});
            if(Temp){
                let com=Temp.comment;
                res.status(200).send({"result":"success","comment":com});
            }
            else{
                res.status(400).send({"result":"Question Id not found. Either it's deleted or something gone wrong"});
            }
        }
        catch (err) {
            console.log(err,'in get_comment');
            res.status(400).send({ "result": "Id not found" });
        }
    }
    catch (err) {
        console.log(err,'in get_comment');
        res.status(400).send({ "result": "Error occured" });
    }
}
module.exports = get_comment;