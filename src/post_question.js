const mongoose = require('mongoose');

const post_question = async (stri, quest, res) => {

    //check if routed id present or not
    try {
        mongoose.connection.db.listCollections({ name: stri })
            .next(function (err, info) {
                //if present:
                if (info && stri.length > 24 && stri.length < 60) {
                    try {
                        const fun = async () => {
                            var Temp;
                            try {
                                // if server is running continuously without restating ever
                                Temp = mongoose.model(stri);
                            }
                            catch (err) {
                                // if server restarted : to handle previously made collections
                                Temp = mongoose.model(stri, expSchema2);
                            }
                            try {
                                const number = await Temp.countDocuments();
                                if (number < 60) {
                                    const createDocument = async () => {
                                        const datacoll = new Temp({
                                            "title": quest
                                        });
                                        const result = await datacoll.save();
                                        // console.log('created successfully');
                                    }
                                    createDocument();
                                    res.send({ "result": "success" });
                                }
                                else {
                                    res.send({ "result": "Can't add more than 60 questions" });
                                }
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }
                        fun();

                    }
                    catch (err) {
                        // console.log('id not match');
                        res.send({ "result": "Id not found" });
                    }
                }
                else {
                    // console.log('id not match');
                    res.send({ "result": "Id not found" });
                }
            })
    }
    catch (err) {
        console.log(err);
        res.send({ "result": "Error occured" });
    }
}
module.exports = post_question;