//FILE WHICH CONTAINS SEARCH FUNCTIONS - ACCESSES APIS

let axios = require("axios");
let Spotify = require('node-spotify-api');

// file which accesses keys
let keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


let searchTerm = process.argv.slice(3).join("+")


// LOGGING DATA FUNCTIONS - TO BE CALLED IN SEARCH FUNCTIONS

let logSongData = (data) => {

  // set variables that access accurate info in response
  let artists = data.tracks.items[0].artists[0].name
  let songName = data.tracks.items[0].name;
  let albumName = data.tracks.items[0].album.name;
  let songPreview = data.tracks.items[0].preview_url;
  let songHref = data.tracks.items[0].href;
  let preview;

  //  conditional to display correct link for preview
  songPreview ? preview = `preview the song: ${songPreview}` :
      songHref ? preview = `No preview available. View full song: ${songHref}` :
      preview = `No preview available`

  console.log(`
  artists: ${artists}
  song-title: ${songName}
  album-title: ${albumName}
  ${preview}
  `)

}


let logConcertData = (response) => {

  let artist = process.argv.slice(3).join(" ")

  let venue = response.data[0].venue.name;
  let city = response.data[0].venue.city;
  let state = response.data[0].venue.region;
  let rawTime = response.data[0].datetime;

  console.log(`
  ${artist}
  Venue: ${venue}
  Location: ${city}, ${state}
  Date: ${rawTime}
  `)

}


// SEARCH FUNCTIONS - GET DATA FROM APIS

let searchConcert = () => {

  let queryURL = `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`;

  axios.get(queryURL).then((response) => {

    console.log(response.data[0])

    logConcertData(response)

  })

}


let searchSong = () => {

  spotify.search({ type: 'track', query: `${searchTerm}` }, function (err, data) {
    
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    logSongData(data);

  });

}


let searchMovie = () => {

  let queryURL = ``;

  axios.get(queryURL).then((response) => {

  })

}



module.exports = {

  searchSong: searchSong,
  searchConcert: searchConcert,
  searchMovie: searchMovie

}