var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dentistSchema = new Schema({
    id: {type: int},
    name: {type: String},
    owner: {type: String},
    dentists: {type: int},
    address: {type: String},
    city: {type: String},
    coordinatelong: {type: double}, //Note: the data type might not reflect the accuracy needed
    coordinatelat: {type: double},
    openinghours: {type: Array}, //Note: The index of the array would represent the weekday, and its content the opening hours

});

module.exports = mongoose.model('dentists', dentistSchema);
