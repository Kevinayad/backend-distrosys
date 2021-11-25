var mongoose = require('mongoose').mongoose;

const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});
mongoose.connect('dentistRepo.json', function (err, db) {
    if (err) throw err;
    var jsonData = db;
    var jsonParsed = JSON.parse(jsonData);
    dbo.collection("dentists").insertOne(jsonParsed, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});