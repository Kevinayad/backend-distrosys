var conns = require("../Database/database");
var broker = require("../broker/broker.js");
//call this method from backend broker
//saves new appointment in database
async function persistAppointment(appointmentMessage){
    var appointment = JSON.parse(appointmentMessage);
    var conn = conns.conn;
    await conns.checkAppointment(appointment);
    
        conn.collection("appointments").insertOne(appointment, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
  
}

exports.persistAppointment = persistAppointment;