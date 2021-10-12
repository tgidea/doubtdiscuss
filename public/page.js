//************************************************************************* *//
const showData = (articles, keyvalue) => {
    const artitem = articles;
    console.log(artitem);
    var items_list = document.getElementById('items-list');
    var keyvalues = keyvalue;
    items_list.innerHTML ='';
    for (var i = 0; i < artitem[0].length; i++) {
        var output = "";
        output += `
            <div class="card text-center border-success">
                 <div class="card-body ">
                 <div class="container">
                     <p class="card-text card-header "><span  style="width:10vw; position:absolute; left:0px;">${i+1}&nbsp;&nbsp;</span>${artitem[0][i].title}</p>
                     <div class="container"  >
                       <div> <button onclick="option(this.classList,this.textContent)"  class="btn btn-outline-success ${artitem[0][i]._id} ${keyvalues}">opt1</button> <span>${artitem[0][i].opt1}</span></div>
                       <div> <button onclick="option(this.classList,this.textContent)" class="btn btn-outline-success ${artitem[0][i]._id}  ${keyvalues}">opt2</button> <span>${artitem[0][i].opt2}</span></div>
                       <div> <button onclick="option(this.classList,this.textContent)" class="btn btn-outline-success ${artitem[0][i]._id}  ${keyvalues}">opt3</button> <span>${artitem[0][i].opt3}</span></div>
                       <div> <button onclick="option(this.classList,this.textContent)" class="btn btn-outline-success ${artitem[0][i]._id}  ${keyvalues}">opt4</button> <span>${artitem[0][i].opt4}</span></div>
                     </div>
                     </div>
                </div>
             </div>`

             items_list.innerHTML += output;
            }
}
//************************************************************************* *//
const getdata = async () => {
    const notify = document.getElementById('notify');
    const fetching = async () => {
        const key = document.getElementById('key');
        const keyvalue = key.value;
        const btn4 = document.getElementById('btn4');
        if (keyvalue == '') {
            // console.log('both empty');
            document.getElementById('notify').innerHTML = `<h6 style="color:red">Please fill all fields</h6>`
            notify.style.display = "block";
        }
        else if (keyvalue != '') {
            try {
                await fetch(`/get/${keyvalue}`)
                    .then(function (resp) {
                        return resp.json();
                    })
                    .then(function (data) {
                        if (data.result == 'success') {
                            const dataAll = [data.alldata];
                            notify.innerHTML = `<h6 style="color:green">Success </h6>`
                            notify.style.display = "block";
                            showData(dataAll, keyvalue);
                        }
                        else {
                            notify.innerHTML = `<h6 style="color:red">${data.result} </h6>`
                            notify.style.display = "block";
                        }
                    }).catch((err) => {
                        notify.innerHTML = `<h6 style="color:red">Error occured</h6>`
                        notify.style.display = "block";
                    })
            }
            catch (err) {
                notify.innerHTML = `<h6 style="color:red">${err} </h6>`
                notify.style.display = "block";
            }
        }
        else {
            notify.innerHTML = `<h6 style="color:red">Please fill all fields</h6>`
            notify.style.display = "block";
        }
    }
    await fetching();
    setTimeout(() => {
        notify.style.display = "none";
    }, 1000);
}

//************************************************************************* *//
const option = async (list, text) => {
    const conf = window.confirm('Are you sure?');
    if (conf) {
        // console.log('here');
        const id = list[2];
        const opti = text;
        const pageid = list[3];
        // console.log(list);
        try {
            await fetch(`/change/${pageid}/${id}/${text}`)
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    if (data.result == 'success') {
                        const dataAll = [data.alldata];
                        notify.innerHTML = `<h6 style="color:green">Success </h6>`
                        notify.style.display = "block";
                        getdata();
                    }
                    else {
                        notify.innerHTML = `<h6 style="color:red">${data.result} </h6>`
                        notify.style.display = "block";
                    }
                }).catch((err) => {
                    notify.innerHTML = `<h6 style="color:red">Error occured :${err}</h6>`
                    notify.style.display = "block";
                })
        }
        catch (err) {
            notify.innerHTML = `<h6 style="color:red">${err} </h6>`
            notify.style.display = "block";
        }
        setTimeout(() => {
            notify.style.display = "none";
        }, 1500);
    }
}
//************************************************************************* *//

const postdata = async () => {
    const notify = document.getElementById('notify');
    const fetching = async () => {

        const key = document.getElementById('key');
        const keyvalue = key.value;
        const quest = document.getElementById('quest');
        var questval = quest.value;
        questval = questval.replace(/\?/, "")
        questval = questval.replace(/\%/, "modulus")
        questval = questval.replace(/\#/, "hash")
        questval = questval.replace(/\//, " divide by ")
        questval = questval.replace(/\n|\n\n|\r\n/g, "<br>")
        questval = questval.toString();
        const btn3 = document.getElementById('btn3');
        if (keyvalue == '' || questval == '') {
            notify.innerHTML = `<h6 style="color:red">Please fill all fields*</h6>`
            notify.style.display = "block";
        }
        else if (keyvalue != '' && questval != '') {
            try {
                console.log(questval);
                await fetch(`/post/${keyvalue}/${questval}`)
                    .then(function (resp) {
                        return resp.json();
                    })
                    .then(function (data) {
                        // console.log(data);
                        if(data.result=="Can't add more than 60 questions"){
                            notify.innerHTML = `<h6 style="color:orange">${data.result}</h6>`
                            notify.style.display = "block";
                        }
                        else{
                        getdata();
                        }
                    });
            }
            catch (err) {
                notify.innerHTML = `<h6 style="color:red">Error with input<br>don't write mathematical terms </h6>`
                notify.style.display = "block";
                // alert(err);
            }
        }
        else {
            notify.innerHTML = `<h6 style="color:red">Fill all fields</h6>`
            notify.style.display = "block";
            // alert('fill all fields correct');
        }
    }
    await fetching();
    setTimeout(() => {
        quest.value='';
        notify.style.display = "none";
    }, 2000);
}
// **********************************************************************

const deletedata = async () => {
    const notify = document.getElementById('notify');
    const fetching = async () => {
        const key = document.getElementById('key');
        const keyvalue = key.value;
        const btn5 = document.getElementById('btn5');
        if (keyvalue == '') {
            // console.log('both empty');
            document.getElementById('notify').innerHTML = `<h6 style="color:red">Please fill id</h6>`
            notify.style.display = "block";
        }
        else if (keyvalue != '') {
            try {
                await fetch(`/delete/${keyvalue}`)
                    .then(function (resp) {
                        return resp.json();
                    })
                    .then(function (data) {
                        if (data.result == 'success') {
                            // const dataAll = [data.alldata];
                            notify.innerHTML = `<h6 style="color:green">Success </h6>`
                            notify.style.display = "block";
                            getdata();
                        }
                        else {
                            notify.innerHTML = `<h6 style="color:red">${data.result} </h6>`
                            notify.style.display = "block";
                        }
                    }).catch((err) => {
                        notify.innerHTML = `<h6 style="color:red">Error occured</h6>`
                        notify.style.display = "block";
                    })
            }
            catch (err) {
                notify.innerHTML = `<h6 style="color:red">${err} </h6>`
                notify.style.display = "block";
            }
        }
        else {
            notify.innerHTML = `<h6 style="color:red">Please fill all fields</h6>`
            notify.style.display = "block";
        }
    }
    await fetching();
    setTimeout(() => {
        notify.style.display = "none";
    }, 1000);
}


