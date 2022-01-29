const mongoose = require('mongoose')
const quesSchema = new mongoose.Schema({
    username: String,
    _id: String,
    comment: [{
        author:String,
        text:String
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

// quesSchema.methods.addComment= async(author,text)=>{
//     try{
//         const obj={
//             author,
//             text
//         }
//         this.comment=this.comment.concat({obj});
//         const dataSave =await this.save();
//         console.log(dataave);
//         return dataSave;
//     }
//     catch(err){
//         console.log(err);
//         console.log('Error in registerschema');
//     }
// }
const QuesModel = mongoose.model('question', quesSchema);

module.exports = QuesModel;