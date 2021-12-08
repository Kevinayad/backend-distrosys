var express = require('express');
var mongoose = require('mongoose');

//ISSUE: appointment.save does not work. Research on how to save on DB using mongoose, or other method
var app = express();
app.use(appointments);

//call this method from backend broker
//saves new appointment in database
function persistAppointment(appointmentMessage){
    var appointment = JSON.parse(appointmentMessage);
    appointment.save();
}

exports.persistAppointment = persistAppointment;