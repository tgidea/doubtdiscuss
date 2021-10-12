
const createNewId = function (length) {
    var result = '';
    var inMid = Math.floor(Math.random() * 10000);
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    result += 'b';
    result += `${inMid}`;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    result += 'm';
    return result;
}


const createLength = function () {
    var len = Math.floor(Math.random() * 10 + 30);
    const str1 = createNewId(len);
    // console.log(str1);
    return str1;
}

document.getElementById('btn1').addEventListener('click', async () => {
    const newid = createLength();
    const fetching = async () => {
        try {
            await fetch(`/newkey/${newid}`)
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    if (data.result == 'success') {
                        alert(`Your id is  ${data.id}`);
                    }
                    else {
                        alert(`${data.result}`);
                    }
                });
            document.getElementById('btn1').disabled = true;

        }
        catch (err) {
            console.log(err);
        }
    }
    await fetching();

     setTimeout(function () {
        document.getElementById('btn1').disabled = false;
    }, 10000);
});

// ********************************************************************************



