var dentist = require('../models/Dentist.js');
const generator = require('./appointment.js');
function parseJson(file,conn) {

    let clinics = [];

    for (let i = 0; i < file['dentists'].length; i++){
        var clinic = file['dentists'][i]
        clinics[i] = clinic;
        //console.log(clinics);
        var myJSON = JSON.parse(JSON.stringify(clinics[i]));
        //const data = JSON.parse(clinics);
        console.log(myJSON);
        // const dentistry = {
        //     id: clinic.id,
        //     name: clinic.name,
        //     owner: clinic.owner,
        //     dentists: clinic.dentists,
        //     address: clinic.address,
        //     city: clinic.city,
        //     coordinatelong: clinic.coordinate.longititude,
        //     coordinatelat: clinic.coordinate.latitude,
        //     opneinghours: clinic.openinghours
        // } 
         dentist(myJSON).save(conn);
         generator.slotGenerator(clinic.openinghours);
        //slotGenerator(clinic.openinghours);
    }



}
module.exports.parseJson = parseJson;
