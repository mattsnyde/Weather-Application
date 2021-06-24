const request = require('request') //import request module
const chalk = require('chalk') //import download chalk module
const API_KEY_WEATHER =  'adf01344c6d72903fc4b615a91eeb298'
const successful = (message) => chalk.bold.green.inverse(message) //style successful outputs
const unsccuessful = (message) => chalk.bold.red.inverse(message) //style errors and unsuccessful output

//Weather api (https://weatherstack.com/documentation)

const forecast = (lat, long, callback) => {
    //This url for the api which contains their website with current property, our accesskey, a query of location which takes lat and long and converts units to f which is the standard in america
    const url = `http://api.weatherstack.com/current?access_key=${API_KEY_WEATHER}&query=${lat},${long}&units=f`

    //response is an object but then only time we are using the response object is to get to the body so we can destructure response to just hold the body, Used to look like "request({url, json:true},(error,response) => {"
    request({url, json: true}, (error, {body}) => { //Here we have request with options object and arrow function with paramters, option object holds our url and json: true which means our data will be parsed automatically
        if(error){ //if error return a message on error properity, and undefined for data
            callback(`${unsuccessful('Unable to connect to weather serivce')}`, undefined)
        }else if(body.error){ //if there is an error in the body reutnr message on error property and undefined for data
            console.log(`${unsuccessful("Unable to find the location provided")}`, undefined) 
        }else{ //We handled all error cases so there cant be any more errors so we set error as undeinfed and then data holds our current forecast. 
            callback(undefined, {
                theCurrentForecast: `It is currently ${body.current.weather_descriptions[0]} outside. The current temperature outside is ${body.current.temperature}℉ , however it feels more like ${body.current.feelslike}℉  outside`,
            })
        }
    })
}


module.exports = forecast; //export forecast