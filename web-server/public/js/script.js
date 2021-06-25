const weatherForm = document.querySelector('#form');
const search = document.querySelector('#address')
const searchBtn = document.querySelector('#search')
let forecast = document.querySelector('#forecast')
let addressDisplay = document.querySelector('#addressDisplay')

const unspecificLoc = /^[a-zA-Z]+$/ //unspecific location is to handle when the user enters 1 simple string with no comma, this could be a city for example
const specificLoc = /^[a-zA-Z\s]+\,[a-zA-Z\s]+$/ //specific location is to handle when user enters 1 string with a comma seperating two words, for example. Phoenix, Arizona
const ultraSpecificLoc = /^[a-zA-Z\s]+\,[a-zA-Z\s]+\,[a-zA-Z\s]+$/ //ultra specific location is to handle when user enters 1 string 2 commas seperating 3 words for example. Maricopa, Arizona, America

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let address = search.value;

    forecast.textContent = 'Loading...'
    addressDisplay.textContent = '';
    if(address.match(unspecificLoc) || address.match(specificLoc) || address.match(ultraSpecificLoc)){
        //Using fetch api
        //First arguement: Pass url we are trying to fetch from then we add a .then and pass in response and an arrow function
        fetch(`http://localhost:5000/weather?address=${address}`).then((response)=>{
            response.json().then((data)=>{
                if(data.error){
                    forecast.innerHTML += data.error
                }else{
                    // forecast.innerHTML += data.forecast
                    // addressDisplay.innerHTML += data.location
                    forecast.textContent = data.forecast;
                    addressDisplay.textContent = data.location;
                }
            })
        })
    }else{
       forecast.textContent = 'Address is not appropriate'
    }
    search.value = '';
})

 