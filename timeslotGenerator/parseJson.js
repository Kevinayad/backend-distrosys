var dentist = require('../models/Dentist.js');
const generator = require('./appointment.js');
function parseJson(file,conn) {

    let clinics = [];

    for (let i = 0; i < file['dentists'].length; i++){
        var clinic = file['dentists'][i]
        clinics[i] = clinic;
        var myJSON = JSON.parse(JSON.stringify(clinics[i]));
        myClinic = dentist(myJSON);
        myClinic.timeSlots = generator.slotGenerator(clinic.openinghours);
        myClinic.save(conn);
    }

}
module.exports.parseJson = parseJson;
