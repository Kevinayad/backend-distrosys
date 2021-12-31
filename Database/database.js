var mongoose = require('mongoose');
const jsonFile = require("./dentistRepo.json");
const parseJson = require('../timeslotGenerator/parseJson');
const broker = require('../broker/broker');
var moment = require('moment');

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

    function timeSlots(topic) {
        dentCollection.find({}).toArray( function(err, result) {
            if (err) throw err;
            var slots =  storeTimeSlots(result);
            stringResult = JSON.stringify(slots);
            broker.publish(topic, stringResult);
            });
    }

    function storeTimeSlots(result) {
        obj = {};
        for (var i = 0; i < result.length; i++){
            var clinic = result[i];
            var timeSlots = clinic.timeSlots;
            var changedTimeSlots = changeTimeSlots(timeSlots);
            var name = 'Clinic' + (i+1);
            obj[name] = changedTimeSlots;
        }
        console.log('Finished');
        return obj;
    }

    function changeTimeSlots(slots) {
        var completeSlots = {};
        const currentDate = new Date();
        var currentDay = currentDate.getDay();
        var dayCounter = 0;
        const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        for (let i = 0; i <slots.length; i++) {
            var location = (i + currentDay) % slots.length;
            if (location != 0 && location != 6) {
                var dayName = allDays[location];
                completeSlots[dayName] = dailySlots(slots[location], dayCounter)
            }
            dayCounter++;
        }
        return completeSlots;
    }

    function dailySlots(slots, days) {
        var newSlots = {};
        if (slots.length > 1) {
            for (let i = 0; i < slots.length; i++){
                var slot = moment(slots[i].time, 'HH:mm');
                slot.add(1, 'hours');
                var date = moment(slot).toDate();
                date.setDate(date.getDate() + days);
                var x = slots[i].av;
                var cDay = slots[i].day;
                var simpleSlot = slots[i].time;
                newSlots[simpleSlot] = {day : cDay, time: date, av: x};
            }
        } else {
            newSlots = 'Unavailable day';
        }
        return newSlots;
    }

    exports.timeSlots = timeSlots;
