const request = require('request') //need to import request module
const chalk = require('chalk')

const successful  = (message) => chalk.green.bold.inverse(message);
const unsuccessful = (message) => chalk.red.bold.inverse(message);

//Geocoding api (https://developer.mapquest.com/documentation/geocoding-api/address/get/)
const API_KEY_GEOCODING = 'PAIghNQdkrF2qidaZC0GVbwYc8nALA8s'
const API_SECRET_GEOCODING = 'NnY45GXBQB305G9u'

const geocode = (address, callback) => {
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY_GEOCODING}&location=${encodeURIComponent(address)}`

    //response is an object but the only time we are using response tis to get to the body so we destrcuture response and just go straight to the body
    request({ url, json: true}, (error, {body}) => { //request takes 2 arguements, 1 options object, and 1 callback function. Options arguemnt has URL we want to make request on and json: true which means it will automatically parse our result. 
        if(error){
           callback(`${unsuccessful("Cannot connect to geocoding service")}`, undefined) //Callback takes 2 paramters 1 being the error and the second being data, in this case if there si an error data is undefined and the error becomes a string
        }else if(body.results[0].locations.length === 0){ //If locations length is 0 thats means that the user did not provide an approrpriate address for us
            callback(`${unsuccessful("Unable to find location")}`, undefined) //assign error as a string and data as undefined
        }else{
            callback(undefined, { //error is undefined because we already ran through all of the error cases and then inside of the data object we have, latiotude, longitude, city name, state abbreviation,  and country abbreviation
                lat: body.results[0].locations[0].displayLatLng.lat, //get lattitude
                lng: body.results[0].locations[0].displayLatLng.lng, //get longitude
                city: body.results[0].locations[0].adminArea5, //get city
                state: body.results[0].locations[0].adminArea3, //get state
                country: body.results[0].locations[0].adminArea1, //get country
            })
        }
    })
}

module.exports = geocode;