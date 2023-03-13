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
if(argv.z != null){
    const timezone = argv.z
} else{
    const timezone = moment.tz.guess()
}

// latitude and longitude variables
let latitude, longitude;

if(argv.n && argv.n >= 0) {
    latitude = argv.n
} else if (argv.s && argv.s < 0) {
    latitude = argv.s*-1
} else {
    console.log("Latitude out of range.");
    process.exit(0);
}

if(argv.e && argv.e >=0) {
    longitude = argv.e
} else if(argv.w && argv.w < 0) {
    longitude = argv.w*-1
} else {
    console.log("Longitude out of range");
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

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}