const geocode = require("./utils/geocode.js"); //gives access to geocode exports
const forecast = require("./utils/forecast.js"); //gives access to forecast exports
const address = process.argv[2]; //Allow user to input an address in console

// Here we are doing callback chaining with asynchronous functions that have I/O operations. forecast is inside of the asynchronous geocode function because we want geocode to execute first and then forecast to follow.
if (address === undefined) {
  //If user does not provide an address in console hit them with the console statement below, otherwise execute our chained callback functions.
  console.log("Please enter a valid address");
} else {
  geocode(`${address}`, (error, { lat, lng, city, state, country }) => {
    //Pass in a location and callback function to geocode function. Typically have 2 paramteres inside of callback like this, usually error if things go wrong and data for when everything works. Here the data object has been destructured and now only contains the names of the properties inside of the data object in the geocode function
    if (error) {
      //If there is an error we will return out of the callback function and none of the other code will be executed.
      return cons0le.log(error);
    }
    forecast(lat, lng, (error, { theCurrentForecast }) => {
      //forecast function which takes in lat, long, and callback function, will console log error and data. lat and lng come from the geocode function which contains a data object made up of lat, lng, city, state, and country, but this object by name data has been destructued. the data object for forecast has also been destructued and now only contains the name of the property inside of the data object.
      if (error) {
        //If there is an error here we will return out of the callback function and and none of the other code will be executed.
        return console.log(error);
      }
      console.log(`${city}, ${state}, ${country}`); //Prints city, state, and country where the dats ic coming from
      console.log(theCurrentForecast); //returns what is is like outside, the temp, and what it feels like.
    });
  });
}
