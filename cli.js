#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

// get arguments
var argv = minimist(process.argv.slice(2))

// help message
if(argv.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("  -h            Show this help message and exit.");
    console.log("  -n, -s        Latitude: N positive; S negative.");
    console.log("  -e, -w        Longitude: E positive; W negative.");
    console.log("  -z            Time zone: uses /etc/timezone by default.");
    console.log("  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("  -v            Verbose output: returns full weather forecast.");
    console.log("  -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

//timezone
let timezone;
if(argv.z != null){
    timezone = argv.z
} else{
    timezone = moment.tz.guess()
}

// latitude and longitude variables
let latitude, longitude;

if(argv.n) {
    latitude = argv.n
} else if (argv.s) {
    latitude = argv.s*-1
}  else{
    console.log("Latitude must be in range.")
    process.exit(0);
}

if(argv.e) {
    longitude = argv.e
} else if(argv.w) {
    longitude = argv.w*-1
} else {
    console.log("Longitude must be in range.");
    process.exit(0);
}
 
// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' +latitude+'&longitude='+longitude+'&daily=precipitation_hours&timezone='+timezone);

// Get the data from the request
const data = await response.json();

//create response text
const days = args.d ?? 1

if(argv.j) {
    console.log(data);
    process.exit(0);
}

// galoshes or no
let galosh, date;

if(data.daily.precipitation_hours[days] > 0) {
    galosh = "You might need your galoshes "
} else {
    galosh = "You will not need your galoshes "
}


if (days == 0) {
  date = "today."
} else if (days > 1) {
  date = "in " + days + " days."
} else {
  date ="tomorrow."
}

console.log(galosh+date); //return