const path = require('path') //get built in path module
const express = require('express') //load in express library, express is a function
const app = express();
const port = 5000;

// console.log(__dirname) //Returns a directory to where the current script is
// console.log(__filename) //Return a directory to where the current file is.
 
const publicDirectoryPath = path.join(__dirname, '../public') //get  everything inside of public which is our static directory.

app.use(express.static(publicDirectoryPath))

 
//Configure what server should do when someone tries to get resource at specific html
    //app.get() takes a route and a function
    //request contains information about the incoming request to the server.
    //response: contains methods of what we are going to send back to requestor

    app.get('/weather', (req, res)=>{ //weather route with callback fucntion containg request and response, sends json object to be loaded onto localhost:5000/weather
        res.send({
            forecast: 'cloudy',
            location: 'Maricopa, AZ, United States'
        })
    })
 
//Starts the server and has it listen on a specific port. Pass callback function that executes when server is up
app.listen(port, () => { 
    console.log('Hello world')
})