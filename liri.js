require("dotenv").config();

let search = require("./search")


if(process.argv[2]) {

  search.performAction();

}
else {

  search.searchType();

}
