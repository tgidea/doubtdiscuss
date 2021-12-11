
const lcset = function (id) {
    // console.log('id obtained are',id);
    const lccount = (localStorage.getItem('dhgetidcount'));
    // console.log('lccount is ',lccount);
    const lcdata = (localStorage.getItem('dhgetiddata'));
    // console.log('lcdata is ',lcdata);
    const tempstr = "" + id;
    let count = 0, ids = "";
    if (lccount == null || lccount == undefined) {
        if (tempstr.length < 60) {
            count = 1;
        }
        else {
            count = 2;
        }
        ids = id;
        localStorage.setItem('dhgetidcount', count);
        localStorage.setItem('dhgetiddata', ids);
    }
    else if (lccount <= 2 && lcdata!=null && lcdata!=undefined) {
        count = Number(lccount) + 1;
        if (tempstr.length < 60 && lccount==1) {
            ids = lcdata + "  " + id;
        }
        else {
            ids = id;
        }
        localStorage.setItem('dhgetidcount', count);
        localStorage.setItem('dhgetiddata', ids);
    }

}
const checklc = function () {
    const lccount = (localStorage.getItem('dhgetidcount'));
    if (lccount == null || lccount == undefined) {
        return 0;
    }
    else {
        return lccount;
    }

}
const getlc = function () {
    const lcdata = (localStorage.getItem('dhgetiddata'));
    if (lcdata == null || lcdata == undefined) {
        return "No ids present"
    }
    else {
        return lcdata;
    }
}
const getLink1=function(j,str){   
    str=str.toString();
    var i;
    var id1="";
    for( i=0;i<str.length;i++){
        if(str[i]==' '){
            i++;
        }
        else{break;}
    }
    
    var k;
    if(i==0){
        i=1;
    }
    for(k=i-1;k<str.length;k++){
        // console.log(k,str[k]);
        id1+=str[k];
        if(str[k]==' '){
            break;
        }
    }
    return {"id":id1,"last":k};
}
const getLink2=function(j,str){
    var i;
    // console.log('j',j);
    var id2="";
    for( i=j;i<str.length;i++){
        if(str[i]!=' '){
            id2+=str[i];
        }
    }
    return id2;
}
const showLink=function(str){
    // console.log('str',str);
    var id1="";
    var id2="";
    var link1,link2;
    var data1=getLink1(0,str);
    // console.log('data1',data1);
    id1=data1.id;
    var i=data1.last;
    id2=getLink2(i+1,str);
    // console.log('id2',id2);
    link1=`http://127.0.0.1:9001/pag/${id1}`;
    // console.log(link1);
    link2=`https://doubthelper.herokuapp.com/pag/${id2}`;
    // console.log(link2);
    document.getElementById('alerttext').innerHTML = `Your Id 1 : <a href="${link1}">Id 1</a>`;
    if(id2!=""){
        document.getElementById('alerttext').innerHTML += `<br> Your id 2 : <a href="${link2}">Id 2</a>`;
    }
}
const alertBox = function () {
    document.getElementsByClassName('alert')[0].style.display = 'block';
    document.getElementsByClassName('alert')[0].style.transition = 'top 0.4s ease-in';
    document.getElementsByClassName('alert')[0].style.top = '1px';
}

document.getElementById('btn1').addEventListener('click', async () => {
    // const newid = createLength();
    const fetching = async () => {
        try {
            await fetch(`/newkey/`)
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    console.log(data.result);
                    
                    if (data.result == 'success') {
                        showLink(data.id.toString());
                        lcset(data.id);
                    }
                    else {
                        // console.log('hre');
                        document.getElementById('alerttext').innerHTML = ` ${data.result}`;
                        lcset(data.id);
                    }
                    alertBox();
                });
        }
        catch (err) {
            console.log(err);
        }
    }
    if (checklc() < 2) {
        // console.log('less than 2');
        document.getElementById('btn1').disabled = true;
        await fetching();
        setTimeout(function () {
            document.getElementById('btn1').disabled = false;
        }, 10000);
    }
    else {
        // console.log('greater than 2');
        const lcdatas = getlc();
        showLink(lcdatas);
        // document.getElementById('alerttext').innerHTML = `<strong>Sorry</strong>,no more ids for you.<br>Your ids are ${lcdatas}`;
        alertBox();
    }

});

// ********************************************************************************
const delalert = async () => {
    document.getElementsByClassName('alert')[0].style.transition = 'top 0.6s ease-in';
    document.getElementsByClassName('alert')[0].style.top = '-500px';
}


