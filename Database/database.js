var mongoose = require('mongoose');
const jsonFile = require("./dentistRepo.json");
var moment = require('moment');

const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
    parseJson(jsonFile);
});

//var conn = mongoose.connection;

function parseJson(file) {

    let clinics = [];

    for (let i = 0; i < file['dentists'].length; i++){
        var clinic = file['dentists'][i]
        clinics[i] = clinic;
        //console.log(clinics);
        slotGenerator(clinic.openinghours);
    }

    //conn.collection("dentists").insert(jsonParsed, function (err, res) {
    //    if (err) throw err;
    //    console.log("1 document inserted");
    //    db.close(); Maybe not used
    //});
};

function slotGenerator(hours){

    generator(hours['monday']);
    //generator(hours['tuesday']);

}

function generator(hours){
    let i = 0
    var first = '';
    while ('-' != hours.charAt(i)){
        first = first + hours.charAt(i);
        i++;
    }
    if (first.length <= 4){
        first = '0' + first;
    }
    var start = moment(first, 'HH:mm');

    i++;
    var last = '';
    while (i < hours.length){
        last = last + hours.charAt(i);
        i++;
    }
    if (last.length <= 4){
        last = '0' + last;
    }
    var end = moment(last, 'HH:mm');

    var times = [];
    while (start <= end){
        times.push(new moment(start).format('HH:mm'));
        start.add(30, 'minutes');
    }
    console.log(times);
}
