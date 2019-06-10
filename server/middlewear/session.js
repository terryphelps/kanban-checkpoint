import expressSession from 'express-session'
var mongoStore = require("connect-mongodb-session")(expressSession);

var store = new mongoStore({
    uri: "mongodb://student:student@classroom-shard-00-00-afyyj.mongodb.net:27017,classroom-shard-00-01-afyyj.mongodb.net:27017,classroom-shard-00-02-afyyj.mongodb.net:27017/kanban?ssl=true&replicaSet=Classroom-shard-0&authSource=admin&retryWrites=true&w=majority", //CHANGE ME!!!!!!
    collection: "Sessions"
});

store.on("error", function (err) {
    console.log("[SESSION ERROR]", err);
});


export default class Session {
    express = expressSession({
        secret: "you should change this", //CHANGE ME!!!!
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 52 * 2,
        },
        store,
        resave: true,
        saveUninitialized: true
    })
}