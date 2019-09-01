//FILE WHICH CONTAINS SEARCH FUNCTIONS - ACCESSES APIS

let axios = require("axios");
let moment = require("moment");
let fs = require("fs");

let Spotify = require('node-spotify-api');

// file which accesses keys
let keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

let artist = ""
let action = process.argv[2];
let searchTerm = process.argv.slice(3).join("+")



// LOGGING DATA FUNCTIONS - TO BE CALLED IN SEARCH FUNCTIONS

let logConcertData = (response) => {

  artist ? artist = artist : 
  process.argv[3] ? artist = process.argv.slice(3).join(" ") : 
  artist = "unknown"

  let venue = response.data[0].venue.name;
  let city = response.data[0].venue.city;
  let state = response.data[0].venue.region;
  let rawTime = response.data[0].datetime;
  let formattedTime = moment(rawTime).format("ddd, MMM Do YYYY, h:mm a")


  console.log(`
  ${artist}
  Venue: ${venue}
  Location: ${city}, ${state}
  Date: ${formattedTime}
  `)

}



let logSongData = (data) => {

  // set variables that access accurate info in response
  let artists = data.tracks.items[0].artists[0].name;
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
  artist(s): ${artists}
  song-title: ${songName}
  album-title: ${albumName}
  ${preview}
  `)

}


let logMovieData = (response) => {

  let movieTitle = response.data.Title;
  let year = response.data.Year;
  let imdbRating = response.data.Ratings[0].Value;
  let rottenTomatoRating = response.data.Ratings[1].Value;
  let countryProduced = response.data.Country;
  let language = response.data.Language;
  let plot = response.data.Plot;
  let actors = response.data.Actors;

  console.log(`
  Title: ${movieTitle}
  Year: ${year}
  IMDB Rating: ${imdbRating}
  Rotten Tomatoes Rating: ${rottenTomatoRating}
  Country Produced: ${countryProduced}
  Language: ${language}
  Actors: ${actors}
  Plot: ${plot}
  `)

}



// SEARCH FUNCTIONS - GET DATA FROM APIS

let searchConcert = () => {

  console.log(searchTerm)
  let queryURL = `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`;

  axios.get(queryURL)
    .then((response) => {

      // console.log(response.data)
      logConcertData(response)

    })
    .catch (function (error) {
      console.log(error)
    })

}


let searchSong = () => {

  !searchTerm ? searchTerm = "The+Sign" : searchTerm = searchTerm

  spotify.search({ type: 'track', query: `${searchTerm}` }, function (err, data) {

    if (err) {
      return console.log('Error occurred: ' + err);
    }

    logSongData(data);

  });

}


let searchMovie = () => {

  !searchTerm ? searchTerm = "Mr.+Nobody" : searchTerm = searchTerm

  let queryURL = `http://www.omdbapi.com/?apikey=c5d29ec1&t=${searchTerm}`;

  axios.get(queryURL).then((response) => {

    logMovieData(response)

  })

}


// READ FILE FUNCTIONS
let readFile = () => {

  try {

    let fileData = fs.readFileSync("./random.txt", 'utf8');
    let splitData = fileData.split(",");

    runFileCommand(splitData)

  }
  catch (e) {

    console.log('Error', e.stack);

  }
}

let runFileCommand = (fileArray) => {

  action = fileArray[0];
  artist = fileArray[1].split(",")

  //get search term from file array, join it with a + and remove quotes
  searchTerm = artist.join("+").replace(/['"]+/g, '');

  performAction();

}



let performAction = () => {

  switch (action) {

    case "concert-this":
      console.log("search for a concert");
      searchConcert();
      break;

    case "spotify-this-song":
      console.log("this is a song");
      searchSong();
      break;

    case "movie-this":
      console.log("search the movie api");
      searchMovie();
      break;

    case "do-what-it-says":
      console.log("run from the file");
      readFile();
      break;

    default:
      console.log("please enter valid command");
      break;

  }
}



module.exports = {

  performAction: performAction

}