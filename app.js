require('dotenv').config();
const express  = require('express');
const https = require('https'); //native standard node model or library to help with a get request 
const bodyParser = require("body-parser"); 

const app = express(); //initialise an express app; 
app.use(bodyParser.urlencoded({extended: true})); 

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
    
});

//catch the post request from index.html; 
app.post("/",function(req,res){
    const query = req.body.cityN;
    const apiKey = process.env.APIKEY;
    const u = "metric"; 
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units="+ u + "";
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description; 
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<h1>The temperature in "+ query + " is " + temp + " degrees celcius.</h1>");
            res.write("<p>The weather description is currently " + weatherDescription + "</p>"); // we can have only one res.send but multiple res.write;
            res.write("<img src=" + imageURL +">"); 
            res.send();
        });

    });
})

//start a port to run 
app.listen(3000, function (){
 console.log("Server is running on port 3000");
});