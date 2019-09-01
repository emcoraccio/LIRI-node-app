# LIRI-node-app

##Purpose and Use

This app is designed for searching for info on movies, songs, or upcoming concerts

The user has two options for completing their search:

  1. entering the command and search when starting the app up
    - valid commands are: 
      * movie-this (use this followed by a movie title)
      `node liri.js movie-this Shawshank Redemption`
      ![movie search](./assets/images/movie-this-screenshot.png)

      * concert-this (use this followed by the name of an artist)
      `node liri.js concert-this Miranda Lambert`

      ![concert search](./assets/images/concert-this-screenshot.png)

      * spotify-this-song (use this followed by the title of a song)
      `node liri.js spotify-this-song Trampoline`

      ![song search](./assets/images/spotify-this-screenshot.png)

      * do-what-it-says (this does not require any extra input)
      `node liri.js do-what-it-says`

      ![file search](./assets/images/do-what-it-says-screenshot.png)
        this accesses the random.txt file and executes the command in that file


  1. starting the app with no command or search paramaters which will launch inquirer for a CLI. This then guides the user through completing the search they would like to make

    `node liri.js`

    ![inquirer main-menu](./assets/images/inquirer-first-menu.png)

    ![inquirer search song](./assets/images/inquirer-search-song.png)

    ![inquirer search movie](./assets/images/inquirer-search-movie.png)

    ![inquirer search movie 2](./assets/images/inquirer-search-movie-2.png)

    ![inquirer search concert](./assets/images/inquirer-search-concert.png)

    ![inquirer search file menu](./assets/images/inquirer-menu-run-file.png)

    ![inquirer search file](./assets/images/inquirer-run-file.png)


## Development

Node was used to develop this.

The packages used in this development were: 
  * axios
  * inquirer
  * node-spotify-api
  * moment
  * fs

Three main js files are currently being used for this
  - keys.js is used to securely access the keys from the .env file
  - search.js is where all of the main functions for the app are stored - it registers the user input and determines which search functions to use and then exports the two functions
  - liri.js runs the app, accessing the function it needs from the search file depending on user input

This was an assignment I completed myself as part of my coding bootcamp