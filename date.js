//jshint esversion:6


//exports the function
module.exports = getDate;


//actual function to get a date using pure JS

function getDate() {

let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};

let day = today.toLocaleDateString("en-Us", options);


//returns day in us format, such as "Tuesday, 12 february"
return day;

}
