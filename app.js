import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

// Securing the API key by loading it from the .env file
dotenv.config();
const weatherAPI = process.env.WEATHER_API_KEY;

// Creating an Express server
const app = express();
const port = 3000;

let cityname;

// To serve static files
app.use(express.static("public"));

// Middleware to parse URL-encoded data from form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Default route: displays London's current weather
app.get("/", async (req, res) => {
    cityname = "london";
    try {

        const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${weatherAPI}`);
        const lati = result.data[0].lat;
        const long = result.data[0].lon;

        const result_main = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${weatherAPI}&units=metric`);

        // Rendering the weather data on the page
        res.render("index.ejs", { result: result_main.data });
    } catch (err) {
        console.log(err.message);
        res.status(400);
    }
});

// Route to display the current weather for the user's city
app.post("/search", async (req, res) => {
    cityname = req.body.city; // City entered by the user
    try {
        const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${weatherAPI}`);
        const lati = result.data[0].lat;
        const long = result.data[0].lon;
        const result_main = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${weatherAPI}&units=metric`);

        // Rendering the weather data on the page
        res.render("index.ejs", { result: result_main.data });
    } catch (err) {
        console.log("Error:", err.message); // Logging error message for debugging
        res.status(400).send("An error occurred while fetching data.");
    }
});

// Making the app available on the specified port
app.listen(port, () => {
    console.log("listening on 3000");
});
