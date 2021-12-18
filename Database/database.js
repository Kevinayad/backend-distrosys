var mongoose = require('mongoose');
const jsonFile = require("./dentistRepo.json");
const parseJson = require('../timeslotGenerator/parseJson');


const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";
var conn = mongoose.connection;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    parseJson.parseJson(jsonFile, conn);
    mongoose.connection.db.listCollections().toArray(function(err, names) {
        if (err) {
            console.log(err);
        }
        else {
            names.forEach(function(e,i,a) {
                console.log("----->", e.name);
            });
        }
});
