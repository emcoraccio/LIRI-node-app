require("dotenv").config();

let Spotify = require('node-spotify-api');
let axios = require("axios");
let moment = require("moment");
let fs = require("fs");

let keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);



let searchConcert = () => {
  
  let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

  axios.get(queryURL).then( (response) => {

  })
  
}


let searchSong = () => {

  spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data.tracks.items); 

  let artists = data.tracks.items[0].artists
  console.log(artists)

  let songName = data.tracks.items[0].album.name;
  console.log(`song-title: ${songName}`)
  });

}


let searchMovie = () => {
  
  let queryURL = ``;

  axios.get(queryURL).then( (response) => {

  })
  
}







let action = process.argv[2];


switch (action) {

  case "concert-this":
    console.log("search for a concert");
    break;

  case "spotify-this-song":
    console.log("this is a song");
    searchSong();
    break;

  case "movie-this":
    console.log("search the movie api");
    break;

  case "do-what-it-says":
    console.log("run from the file");
    break;

  default:
    console.log("please enter valid command");
    break;

}


