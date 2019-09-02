//FILE WHICH CONTAINS SEARCH FUNCTIONS - ACCESSES APIS

let axios = require("axios");
let moment = require("moment");
let fs = require("fs");
let inquirer = require("inquirer");

let Spotify = require('node-spotify-api');


// file which accesses keys
let keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

let artist = ""
let songLength;
let action;
let searchTerm;
let index = 0;

if (process.argv[2]) {

  action = process.argv[2];

}

if (process.argv[3]) {

  searchTerm = process.argv.slice(3).join("+");

}



// LOGGING DATA FUNCTIONS - TO BE CALLED IN SEARCH FUNCTIONS

let logConcertData = (response) => {

  artist ? artist = artist :
    process.argv[3] ? artist = process.argv.slice(3).join(" ") :
      searchTerm ? artist = searchTerm.split("+").join(" ") :
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

  anotherSearch();

}



let logSongData = (data) => {

  // set variables that access accurate info in response
  let artists = data.tracks.items[index].artists[0].name;
  let songName = data.tracks.items[index].name;
  let albumName = data.tracks.items[index].album.name;
  let songPreview = data.tracks.items[index].preview_url;
  let songHref = data.tracks.items[index].href;
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

  nextEntry();

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

  anotherSearch();

}



// SEARCH FUNCTIONS - GET DATA FROM APIS

let searchConcert = () => {

  let queryURL = `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`;

  axios.get(queryURL)
    .then((response) => {

      logConcertData(response)

    })
    .catch(function (error) {
      console.log(error)
    })

}


let searchSong = () => {

  !searchTerm ? searchTerm = "the+sign%20artist:ace" : searchTerm = searchTerm

  spotify.request(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`)
    .then(function (data) {

      songLength = data.tracks.items.length - 1
      logSongData(data)

    }).catch(function (err) {

      console.error(`error occurred: ${err}`)

    })
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


// Switch statement to run correct action
let performAction = () => {

  switch (action) {

    case "concert-this":
    case "concert":
      searchConcert();
      break;

    case "spotify-this-song":
    case "song":
      searchSong();
      break;

    case "movie-this":
    case "movie":
      searchMovie();
      break;

    case "do-what-it-says":
      readFile();
      break;

    default:
      console.log("please enter valid command");
      break;

  }

}


// INQUIRER FUNCTIONS
let searchType = () => {

  inquirer
    .prompt([
      {
        type: "list",
        name: "searchType",
        message: "What would you like to search for?",
        choices: ["song", "movie", "concert", "search from the file"]
      }

    ]).then(function (type) {


      if (type.searchType === "search from the file") {

        action = "do-what-it-says"
        performAction();

      }
      else {

        action = `${type.searchType}`;
        searchQuery(type);

      }

    })
}


let searchQuery = (type) => {

  inquirer.prompt([
    {

      type: "input",
      name: "searchName",
      message: `Which ${type.searchType} are you looking for info on?`
    }

  ]).then(response => {

    searchTerm = response.searchName
    searchTerm = searchTerm.split(" ").join("+")

    if(type.searchType == "song") {

      confirmArtist();

    }
    else {

      performAction();

    }

  })

}


let confirmArtist = () => {
  inquirer.prompt([

    {
      type: "confirm",
      name: "confirmArtist",
      message: "would you like to add the artist to your search?"
    }

  ]).then(response => {

    if(response.confirmArtist) {

      addArtist();

    }
    else {

      performAction();

    }

  })
}


let addArtist = () => {

  inquirer.prompt([
    {
      type: "input",
      name: "artist",
      message: "What is the name of the artist for the song you are looking for?"
    }
  ]).then(response => {

    let artistInput = response.artist.split(" ").join("+")
    searchTerm += `%20artist:${artistInput}`

    searchSong();

  })

}


let nextEntry = () => {

  if (!process.argv[2]) {

    inquirer.prompt([

      {
        type: "confirm",
        name: "correctSong",
        message: "Is this the song you were looking for?"
      }

    ]).then(response => {

      if (!response.correctSong) {
        if (index < songLength) {

          index++
          searchSong();

        }
        else {

          console.log("That is all of the available song info")
          index = 0;
          anotherSearch();

        }
      }
      else {

        index = 0;
        anotherSearch();

      }


    })

  }
}


let anotherSearch = () => {

  if (!process.argv[2]) {

    inquirer.prompt([

      {
        type: "confirm",
        name: "searchAgain",
        message: "Would you like to make another search?"
      }

    ]).then(response => {

      if (response.searchAgain) searchType()

    })

  }

}


module.exports = {

  searchType: searchType,
  performAction: performAction

}