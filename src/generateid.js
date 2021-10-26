const createNewId = async (length) =>{
    var result = '';
    var inMid = Math.floor(Math.random() * 1000000);
    var characters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    result += 'b';
    result += `${inMid}`;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    result += 's';
    return result;
}


const createLength = async ()=>{
    var len = Math.floor(Math.random() * 10 + 30);
    const str1 =await createNewId(len);
    // console.log(str1);
    return str1;
}
module.exports=createLength;