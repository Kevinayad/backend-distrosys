
var moment = require('moment');
function slotGenerator(hours){

    generator(hours['monday']);
    generator(hours['tuesday']);
    generator(hours['wednesday']);
    generator(hours['thursday']);
    generator(hours['friday']);

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
   while (start <= end){
       times.push(new moment(start).format('HH:mm'));
       start.add(30, 'minutes');
   }
   console.log(times);
}
module.exports.slotGenerator = slotGenerator;