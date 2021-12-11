
const lcset = function (id) {
    const lccount = (localStorage.getItem('dhgetidcount'));
    const lcdata = (localStorage.getItem('dhgetiddata'));
    const tempstr = id.toString();
    let count = 0, ids = "";
    if (lccount == null || lccount == undefined) {
        if (tempstr.length < 40) {
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
        if (tempstr.length < 40 && lccount==1) {
            ids = lcdata +" "+ id;
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
        return "/";
    }
    else {
        return lcdata;
    }
}

const showLink=function(str){
    // console.log('str',str);
    let id1="";
    let id2="";
    let data = str.split(" ");
    for(var i=0;i<data.length;i++){
        if(data[i]==""){
            continue;
        }
        else if(id1==""){
            id1=data[i];
        }
        else if(id2==""){
            id2=data[i];
        }
        else{
            break;
        }
    } 
    link1=`/pag/${id1}`;
    link2=`/pag/${id2}`;
    document.getElementById('alerttext').innerHTML = `Your Id 1 : <a href="${link1}">Id 1</a>`;
    if(id2!=""){
        document.getElementById('alerttext').innerHTML += `<br> Your id 2 : <a href="${link2}">Id 2</a>`;
    }
}
// *******************

const alertBox = function () {
    document.getElementsByClassName('alert')[0].style.display = 'block';
    document.getElementsByClassName('alert')[0].style.transition = 'top 0.4s ease-in';
    document.getElementsByClassName('alert')[0].style.top = '1px';
}

// *******************
document.getElementById('btn1').addEventListener('click', async () => {
    // const newid = createLength();
    const fetching = async () => {
        try {
            await fetch(`/newkey/`)
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    // console.log(data.result);
                    if (data.result.toLowerCase() == 'success') {
                        showLink(data.id.toString());
                        lcset(data.id);
                    }
                    else {
                        // console.log('hre');
                        document.getElementById('alerttext').innerHTML = `${data.result}`;
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
        const lcdatas = getlc();
        showLink(lcdatas);
        alertBox();
    }

});

// ********************************************************************************
const delalert = async () => {
    document.getElementsByClassName('alert')[0].style.transition = 'top 0.6s ease-in';
    document.getElementsByClassName('alert')[0].style.top = '-500px';
}


