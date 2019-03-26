

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var schedule = require("node-schedule");

console.log("Starting repopulate script...")

var j = schedule.scheduleJob('12 01 * * *', function(fireDate){
    const url = "http://35.168.54.90/populate";
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();

    http.onreadystatechange=(e) => {
        console.log(http.responseText);
    }

});