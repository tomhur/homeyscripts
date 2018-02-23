//turn on car heater based on outside temp so
//the car is warm 30 min after alarm in the morning
var hot = args[0];
hot = hot.split(":");
hot = Number(hot[0])*60 + Number(hot[1]) + 30;
var now = new Date().getHours()*60 + new Date().getMinutes();

if (now > hot) return false;

var temp;
let devices = await Homey.devices.getDevices();
_.forEach(devices, device => {
    if (device.name == "väder:Ute") {
        temp = device.state.measure_temperature;
    }
});
var before = Math.floor((temp-12)/-0.28);
var toSleep = hot - now - before;
var shuttoff = hot - now + 30;
/*
console.log("Current time: " + now);
console.log("Then the car should be hot: " + hot);
console.log("Heater should start mins before: " + before);
console.log("Mins to sleep before starting heater: " + toSleep);
*/
_.forEach(devices, device => {
    if (device.name == "Garage outside") {
        _.delay(function() {device.setCapabilityValue('onoff', true);} , toSleep*1000);
        _.delay(function() {device.setCapabilityValue('onoff', false);} , shuttoff*1000);
    }
});

return true;
