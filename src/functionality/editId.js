const mongoose = require('mongoose');
const IdData = require('../schema/idSchemaModal');
const idSchema = require('../schema/idSchema');

const editId = async (res,req,idName,fun,event) => {
    try{
        const result = await IdData.findOne({name:idName});    
        if(result){
            if(fun=="limit"){
                if(event>200){
                    event=200;
                }
                try{
                    const limit =await IdData.updateOne({ name: idName },
                        { $set: { limit: event } })  ;
                        res.send({"result":"Successfully changed"});                       
                }
                catch(err){
                    res.send({"result":"Error in updating Limit"});
                }
            }
            else if(fun=="deniedTo"){
                try{
                    let recent=result.deniedTo;
                    if(recent.indexOf(` ${event} `)>-1){
                        console.log(recent);
                        recent = recent.replace(` ${event} `,"");
                        event="";
                    }
                    if(recent==""){
                        recent=" ";
                    }
                    const denied=await IdData.updateOne({name:idName},{
                        $set:{
                            "deniedTo":` ${recent} ${event} `
                        }
                    })
                    res.send({"result":"Done"});
                }
                catch(err){
                    res.send({"result":"Error in updating denied To"});
                }
            }
            else if(fun=="active"){
                try{
                    const recent=result.active;
                    let change=true;
                    if(recent==true){
                        change=false;
                    }
                    const active=await IdData.updateOne({name:idName},{
                        $set:{
                            "active":change
                        }
                    })
                    res.send({"result":"Successfully updated"});
                }
                catch(err){
                    res.send({"result":"Error in updating active state"});
                }
            }
        }
        else{
            res.send({"result":"Id not found"});
        }
    }
    catch(err){
        console.log(err);
        res.send({"result":err});
    }
}
module.exports = editId;