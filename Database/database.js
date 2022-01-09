var mongoose = require('mongoose');
const jsonFile = require("./dentistRepo.json");
const parseJson = require('../timeslotGenerator/parseJson');
const broker = require('../broker/broker');
var moment = require('moment');

const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";

var dentCollection;
var scheduleCollection;
var conn = mongoose.connection;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    dentCollection = conn.collection("dentists");

    scheduleCollection = conn.collection("schedule");

    // To Count Documents of a particular collection
    dentCollection.count(function(err, count) {
        if (err) console.dir(err);

        if(count == 0) {
            parseJson.parseJson(jsonFile, conn);
            timeSlots(1);
            console.log("The dentists are successfully saved into the database");
        }
        else {
            console.log("Number of registered dentists: " + count);
        }
    });
    });

    async function timeSlots(topic) {
            if (topic == 1) {
                dentCollection.find({}).toArray( function(err, result) {
                    if (err) throw err;
                    var slots =  storeTimeSlots(result);
                    saveSchedule(slots);
                });
            } else {
                var result = await scheduleCollection.findOne({});
                var schedule = scheduleFrontend(result);
                broker.publish(topic, schedule);
                console.log('Schedule sent to: ' + topic + ' topic.');
            }
    }

    function scheduleFrontend(result) {
        var obj = {};
        for (let i = 0; i < 4; i++) {
            var name = 'Clinic' + (i+1);
            var clinicSchedule = [];
            for ( let e = 0; e < 4; e++){
            var clinic = result[name][e]['slots'];
            for (let j = 0; j < 5; j++) {
                var day = clinic[j];
                const keys = Object.keys(day);
                var slotArray = [];
                keys.forEach( (key, index) => {
                    var slot = day[key];
                    if (slot.av == false) {
                        
                    } else {
                        slotArray.push({ date: slot.time });
                    }
                });
                var firstDate = slotArray[0].date;
                var fDate = new Date(firstDate);
                fDate.setHours(1,0,0);
                clinicSchedule.push({ date: fDate, slots: slotArray });
            }
            }
            obj[name] = clinicSchedule;
        }
        var stringObj = JSON.stringify(obj);
        return stringObj;
    };

    function saveSchedule(slots) {
        scheduleCollection.insertOne(slots, function (err, res) {
            if (err) {
                throw err;
            }
            console.log('Schedule for four weeks inserted');
        })
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
        return obj;
    }

    function changeTimeSlots(slots) {
        var completeSlots = [];
        const currentDate = new Date();
        var currentDay = currentDate.getDay();
        var dayCounter = 0;
        for (let j = 0; j < 4; j++){
            var weekSlots = [];
        for (let i = 0; i < slots.length; i++) {
            var location = (i + currentDay) % slots.length;
            if (location != 0 && location != 6) {
                var daySlots = dailySlots(slots[location], dayCounter)
                weekSlots.push(daySlots);
            }
            dayCounter++;
        }
        var weekNumber = (j+1);
        var week = { slots: weekSlots, week: weekNumber};
        completeSlots.push(week);
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

    async function checkAppointment(appointment) {
        var clinicID = appointment.dentistid;
        var date = new Date(appointment.date);
        var day = date.getDay();
        var time = appointment.time;
        var hours = time.slice(0,2);
        var minutes = time.slice(3,5);
        date.setHours(hours,minutes,0);
        date.setTime(date.getTime() + (1*60*60*1000));
        var clinicName = 'Clinic' + (clinicID);
        var result = await scheduleCollection.findOne({});
        var clinic = result[clinicName];
        const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var daySchedule = clinic[allDays[day]];
        var slot = daySchedule[time];
            slot.av = false;
            await scheduleCollection.deleteOne({}, function (err, res) {
                if (err) {throw err};
                console.log('First schedule removed');
            });
            await scheduleCollection.insertOne(result, function (err, res) {
                if (err) {throw err};
                console.log('Second schedule added');
            });
        

    }

    exports.timeSlots = timeSlots;
    exports.checkAppointment = checkAppointment;
    exports.conn = conn;


