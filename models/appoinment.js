var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    userid: {type: int},
    requestid: {type: int},
    dentistid: {type: int},
    issuance: {type: int},
    date: {type: Date}
});

module.exports = mongoose.model('appointments', appointmentSchema);
