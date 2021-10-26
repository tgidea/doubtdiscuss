
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
                    // console.log(data.result);
                    if (data.result == 'success') {
                        document.getElementById('alerttext').innerHTML = `Your id : ${data.id}`;
                        lcset(data.id);
                    }
                    else {
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
        document.getElementById('alerttext').innerHTML = `<strong>Sorry</strong>,no more ids for you.<br>Your ids are ${lcdatas}`;
        alertBox();
    }

});

// ********************************************************************************
const delalert = async () => {
    document.getElementsByClassName('alert')[0].style.transition = 'top 0.6s ease-in';
    document.getElementsByClassName('alert')[0].style.top = '-500px';
}


