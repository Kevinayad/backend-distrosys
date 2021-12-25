
var moment = require('moment');
function slotGenerator(hours){

    var totalTimes = {};

    totalTimes['monday'] = generator(hours['monday']);
    totalTimes['tuesday'] = generator(hours['tuesday']);
    totalTimes['wednesday'] = generator(hours['wednesday']);
    totalTimes['thursday'] = generator(hours['thursday']);
    totalTimes['friday'] = generator(hours['friday']);

    return totalTimes;

}

function generator(hours){
   let i = 0
   var first = '';
   while ('-' != hours.charAt(i)){
       first = first + hours.charAt(i);
       i++;
   }
   if (first.length <= 4){
       first = '0' + first;
   }
   var start = moment(first, 'HH:mm');

   i++;
   var last = '';
   while (i < hours.length){
       last = last + hours.charAt(i);
       i++;
   }
   if (last.length <= 4){
       last = '0' + last;
   }
   var end = moment(last, 'HH:mm');

   var times = [];
   var x = true;
   while (start <= end){
       var slot = moment(start).format('HH:mm')
       if (slot == '11:30' || slot == '12:00' || slot == '16:00'){
           x = false;
       }
       times.push({time: new moment(start).format('HH:mm'), av: x});
       start.add(30, 'minutes');
       x = true;
   }
   return times;
}
module.exports.slotGenerator = slotGenerator;
