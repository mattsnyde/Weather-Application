const request = require('request')
const geocode = require('./utils/geocode')
const forecast =require('./utils/forecast')
const hbs = require('hbs') //load in hbs module.
const path = require('path') //get built in path module
const express = require('express'); //load in express library, express is a function
const app = express();
const portHeroku = process.env.PORT || 5000;

//In order to restart server when new templates are created we can just tweak our "nodeman app.js" that we been running inside of our terminal.
    //The new command that we want to be using instead of nodeman app.js is "nodeman app.js -e js, hbs"
    //The -e flag is short for extensions and allows us to provide a comma seperated list of different extensions,  that nodeman needs to watch. 

// console.log(__dirname) //Returns a directory to where the current script is
// console.log(__filename) //Return a directory to where the current file is.
 
//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public') //get  everything inside of public which is our static directory.
const viewsPath = path.join(__dirname, '../templates/views') //This allows us to get to our directory of templates which holds the handle bars files.
const partialsPath = path.join(__dirname, '../templates/partials') //get to partials folder inside of the templates folder.

//handleBars is a template engine that allows us to render dynamic documents instead of static and also allow us to easily create code that we can use across pages.
//hbs stands for handlebars which is a library we isntalled from npm and it allows us to render dynamic templates with express
//When using this library it expects your files to live in a certain destination and that would be in a folder inside the root directory valled views. In this case web-server is our root directory so we need to make a folder called views inside of it.
app.set('view engine', 'hbs')//app.set() allows you to set a value for a given express setting, key which is setting name, and value which is what we want to set for the setting name. Here the name is view engine and the value is hbs.

app.set('views', viewsPath) //Make a custom views location instead of having to use the views folder name we can now use whatever name we would like.

hbs.registerPartials(partialsPath) //hbs.registerPartials takes a path to the directory of where your partials live. 

app.use(express.static(publicDirectoryPath))//Static means the assets are not changing. 

//Configure what server should do when someone tries to get resource at specific html
    //app.get() takes a route and a function
    //request contains information about the incoming request to the server.
    //response: contains methods of what we are going to send back to requestor

//If you want to pass dynamic content to our views file then we must have 2 arguements inside of res.render, the first arguement being the name fo the file and the second arguement being an object of what we want to dynamically display.
app.get('', (req, res)=>{ //express goes off and gets the view called index from views folder, it then converts it to html and it makes sure html gets back to the user requesting the file.
    res.render('index', {//res.render allows us to display one of our views (views means handle bar templates). Allow we have to do to render the view is provide the name, no extension is necessary, the name must be the same name as the name of the template you made in the views folder
        title:'Weather App', //Provide a title
        name:'Matthew Snyder', //Provide a name
        createdDate: '6/25/2021'
    }) 
})

app.get('/about', (req, res)=>{ //Dynamic templating for the about.hbs page
    res.render('about', {
        mission: 'Our goal is to provide the most accurate weather possible and in a time efficent manner',
        questions: 'If there are any questions please feel free to shoot us an email using the form that we have attached for your convienence below.',
        title:'About',
        name:'Matthew Snyder',
        createdDate: '6/25/2021'
    })
})

app.get('/help', (req, res)=>{ //Dynamic templating for help.hbs page
    res.render('help', {
        helpStatement: 'If you need help please see our contact page because that is the best way to get in contact with us',
        title: 'Help',
        name: 'Matthew Snyder',
        createdDate: '6/25/2021'
    })
})

app.get('/weather', (req, res)=>{ //weather route with callback fucntion containg request and response, sends json object to be loaded onto localhost:5000/weather
    if(!req.query.address){ //If there is no address key then we want to return an error and not proceed
        return res.send({
            error: 'You did not enter an address'
        })
    }
    geocode(req.query.address, (error, {lat, lng, city, state, country} = {}) => { //Pass in the address provided by user, as well as a callback function which has an error paramter and a destructured objec that contains lat, lng, city state country
        if(error){ //If something goes wrong return an error and do not proceed
            return res.send({
                error
            })
        }
        forecast(lat, lng, (error, {theCurrentForecast}) => { //Pass in 3 values 2 of whihc are provided by the user, lat and lng from geocode and then a callback function with paramter of error and a destructed object which contains theCurrentForecast.
            if(error){ //If there is an error do not proceed and return the error message
                res.send({
                    error
                })
            }
            res.send({ //Nothing went wrong and now we can return a JSOn object to the screen that contains the forecast, the location which is a combination of a city, state, country and the address that the user provided. 
                forecast: theCurrentForecast,
                location: `${city},${state},${country}`,
                address: req.query.address,
            })
        })
    })
})

//You cannot response to a requst 2x.
app.get('/products', (req, res) => { //request is an object as well as query and query holds the query string info
    //console.log(req.query) //returns an object with query keys and values, for example if i had a string that read "localhost:5000/products/search=games&rating=5" I would get an object that says [search: "games", rating: "5"]
    //console.log(req.query.search) //grab an individual value from our query object //in th games of example on line 72 we get games.
    if(!req.query.search){ //if search term is not provided run this
        return res.send({ //Makes it so we are not trying to respond 2x.
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res)=>{ //This is going to match any page that has not been defined yet for example we may have defined a /help/data above but we dont have a /help/test so we will respond with this.
    res.render('404', { //on the 404 handler bar display help article not found
        title: '404',
        name: 'Matthew Snyder',
        errorMessage: 'Help article not found',
        createdDate: '6/25/2021'
    })
})

app.get('*', (req, res)=>{ //Handle what we do when user goes to an undefined url. The * character means any file route that has not been defined above. This always goes as the last app.get 
    res.render('404', { //On the 404 handle bar display 'Page not found'
        title: '404',
        name: 'Matthew Snyder',
        errorMessage: 'Page not found',
        createdDate: '6/25/2021'
    })
})
 
//Starts the server and has it listen on a specific port. Pass callback function that executes when server is up
app.listen(portHeroku, () => { 
    console.log(`Server is up ${portHeroku}`)
})