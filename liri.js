require("dotenv").config();

let search = require("./search")

let inquirer = require("inquirer");
let moment = require("moment");
let fs = require("fs");



let action = process.argv[2];


switch (action) {

  case "concert-this":
    console.log("search for a concert");
    search.searchConcert();
    break;

  case "spotify-this-song":
    console.log("this is a song");
    search.searchSong();
    break;

  case "movie-this":
    console.log("search the movie api");
    search.searchMovie();
    break;

  case "do-what-it-says":
    console.log("run from the file");
    break;

  default:
    console.log("please enter valid command");
    break;

}


