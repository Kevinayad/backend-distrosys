var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dentistSchema = new Schema({
    id: {type: Number},
    name: {type: String},
    owner: {type: String},
    dentists: {type: Number},
    address: {type: String},
    city: {type: String},
    coordinate: {type: Array }, //Note: the data type might not reflect the accuracy needed
    openinghours: {type: Array}, //Note: The index of the array would represent the weekday, and its content the opening hours

});

module.exports = mongoose.model('Dentist', dentistSchema);
