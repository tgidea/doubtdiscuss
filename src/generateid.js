const createNewId = async (length) =>{
    var result = '';
    var inMid = ""+Date.now();
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
    var len = Math.floor(Math.random() * 10 + 10);
    const str1 =await createNewId(len);
    // console.log(str1);
    return str1;
}
// createLength().then((data)=> console.log(data) );
module.exports=createLength;