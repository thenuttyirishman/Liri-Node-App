// Require dotenv file to protect keys
require("dotenv").config();
// Require keys.js file
var keys = require("./keys.js");
// Require request package
var request = require("request");
// Require fs package
var fs = require("fs");
// Require moment package
var moment = require('moment');
// Require Spotify API
var Spotify = require('node-spotify-api');
// Variable
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchItem = "";
var inputString = "";
var line1;
var line2;
var line3;
var line4;
var line5;
var line6;
var line7;
var line8;

//
var inputArr = process.argv.splice(3);
console.log(inputArr);

console.log(inputArr.length);
// For loop for user input
for (i = 0; i < inputArr.length; i++) {
    if (i < inputArr.length - 1) {
        inputString += (inputArr[i] + "+");
    } else {
        inputString += inputArr[i];
    }

};
//
// For loop 
var commandLine = "";
for (i = 0; i < process.argv.length; i++) {
    commandLine += (process.argv[i] + " ");
};

for (i = 3; i < process.argv.length; i++) {
    searchItem += (process.argv[i] + " ");
}

searchItem = searchItem.trim();
// Switch statement for command line
switch (command) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        break;
};
// Function for concert search
function concertThis() {
    if (!searchItem) {
        searchItem = "Red Hot Chili Peppers"
    }
    request("https://rest.bandsintown.com/artists/" + inputString + "/events?app_id=codingbootcamp", function (error, response, body, data) {

        if (JSON.parse(body)[0] === undefined) {
            console.log("No upcoming shows found.")
        }
        else {
            line1 = searchItem + "Playing at" + JSON.parse(body)[0].venue.name +
                ", " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0]
                    .venue.region + ", " + JSON.parse(body)[0].venue.country;
            line2 = moment(JSON.parse(body)[0].datetime).format('MM/DD/YY');
            console.log(line1);
            console.log(line2);
            logFile();
        }
    });

};
// Function for Spotify search
function spotifyThis() {
    if (searchItem) {
        searchItem = "My Friends by Red Hot Chili Peppers"
    }
    spotify.search({ type: "track", query: inputString }, function (err, response) {
        if (err) {
            return console.log('Error Occurred: ' + err);
        }
        line1 = "\ninputStrings: " + JSON.stringify(response.tracks.items[0].inputString[0].name);
        line2 = "\nSong: " + JSON.stringify(response.tracks.items[0].name[0].song);
        line3 = "\nSpotify sample: " + JSON.stringify(response.tracks.items[0].name.album.inputString[0].external_urls.spotify);
        line4 = "\nAlbum: " + JSON.stringify(response.tracks.items[0].album.inputStrings[0].album);
        console.log(line1);
        console.log(line2);
        console.log(line3);
        console.log(line4);
        logFile();
    });
}
// Funtion for movie search
function movieThis() {
    if (!searchItem) {
        searchItem = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?t=" + inputString + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Yo", response);
            line1 = "Title: " + JSON.parse(body).Title;
            line2 = "Release Year: " + JSON.parse(body).Year;
            line3 = "IMDb Rating: " + JSON.parse(body).imdbRating;
            line4 = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
            line5 = "Country: " + JSON.parse(body).Country;
            line6 = "Language: " + JSON.parse(body).Language;
            line7 = "Plot: " + JSON.parse(body).Plot;
            line8 = "Actors: " + JSON.parse(body).Actors;
            console.log(line1);
            console.log(line2);
            console.log(line3);
            console.log(line4);
            console.log(line5);
            console.log(line6);
            console.log(line7);
            console.log(line8);
            logFile();
        }
    });
};
//Function for do what it asks command
function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        searchItem = dataArr[1];
        spotifyThis();
    })
};
//Function for appending recent search data to the log file
function logFile() {
    fs.appendFile("log.txt", "\r\n" + commandLine + "\r\n" + line1 + "\r\n" +
        line2 + "\r\n" + line3 + "\r\n" + line4 + "\r\n" + line5 + "\r\n" +
        line6 + "\r\n" + line7 + "r/n" + line7 + "\r\n" + line8, function (error) {
            if (error) {
                return console.log(error);
            }
        });
};