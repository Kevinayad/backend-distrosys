var mongoose = require('mongoose');

//call this method from backend broker
//saves new appointment in database
function persistAppointment(appointmentMessage){
    var appointment = JSON.parse(appointmentMessage);
    var conn = mongoose.connection;
    conn.collection("appointments").insert(appointment, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
}

exports.persistAppointment = persistAppointment;