var mongoose = require('mongoose');
const jsonFile = require("./dentistRepo.json");
const parseJson = require('../timeslotGenerator/parseJson');

const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";

var dentCollection;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    var conn = mongoose.connection;

    dentCollection = conn.collection("dentists");

    // To Count Documents of a particular collection
    dentCollection.count(function(err, count) {
        if (err) console.dir(err);

        if( count == 0) {
            parseJson.parseJson(jsonFile, conn);
            console.log("The dentists are successfully saved into the database");
        }
        else {
            console.log("Number of registered dentists: " + count);
        }
    });
    });

    var allClinics = [];

    function getTimeSlots() {
        dentCollection.find({}).toArray( function(err, result) {
            if (err) throw err;
            storeTimeSlots(result);
            });
        return allClinics;
    }

    function storeTimeSlots(result) {
        for (var i = 0; i < result.length; i++){
            var clinic = result[i];
            var timeSlots = clinic.timeSlots;
            var name = "Clinic " + (i+1);
            allClinics[name] = timeSlots;
        }
        console.log('Finished');
    }
    exports.getTimeSlots = getTimeSlots;
