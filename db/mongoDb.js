const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@bobo-chat-g7ymt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

client.connect((err, db) => {

    let chat = db.db("chat");
    let users = chat.collection('users');
    let messages = chat.collection('messages');

    function insertUser(username, password, callback) {
        if (err) throw err;

        users.insertOne({ username: username, password: password }, function (err, res) {
            if (err) throw err;

            callback(res);
        })
    }

    function selectUser(username, callback){
        if (err) throw err;

        users.findOne({username: username}, function (err, result) {
            if (err) throw err;

            if (result) {
                callback( {username: username, password: result.password})
            }
            else{
                callback( null);
            }
        })
    }

    function insertMessage(sender, receiver, msg, callback){
        if(err) throw err;

        messages.findOne({sender: sender, receiver: receiver}, (error, result) => {
            if (err) throw err;

            if (result) {
                result.msg.push(msg);
                let data = result.msg;

                    messages.updateOne({sender: sender, receiver: receiver},{ $set: {msg: data}}, (error1, result1) => {
                    console.log('updated')
                    //console.log(result1.msg)
                })

                //console.log(result.msg)
            }else
            {
                messages.insertOne({sender: sender, receiver: receiver, msg: [msg]},(error1, result1) => {
                    if (err) throw err;

                    callback(result1);
                })
                console.log('inserted')
            }

        })

    }

    function loadMessages(sender, receiver, callback) {
        if (err) throw err;

        messages.findOne({ sender: sender, receiver: receiver }, (error, result) => {
            if (err) throw err;

            if (result) {
                callback(result.msg)
            }else{
                callback([])
            }
        })
    }


    module.exports.insertUser = insertUser;
    module.exports.selectUser = selectUser;
    module.exports.insertMessage = insertMessage;
    module.exports.loadMessages = loadMessages;


})


    