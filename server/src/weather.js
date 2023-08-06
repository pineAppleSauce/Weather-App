const express = require("express");
const axios = require("axios");
const router = express.Router();
const cron = require('node-cron');
const average = require('./utils')

router.get("/weather", async (req, res) => {
  const city = req.query.city;
  const openWeatherAPIKey = process.env.OPENWEATHER_API_KEY;
  const weatherapiAPIKey = process.env.WEATHERAPI_API_KEY;

  try {
    const [
      openWeatherCurrentResponse,
      openWeatherForecastResponse,
      weatherAPICurrentResponse,
      weatherAPIForecastResponse,
    ] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPIKey}`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPIKey}`
      ),
      axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${weatherapiAPIKey}&q=${city}&aqi=no`
      ),
      axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${weatherapiAPIKey}&q=${city}&days=1&aqi=no&alerts=no`
      ),
    ]);

    const openWeatherCurrentTemperature =
      openWeatherCurrentResponse.data.main.temp - 273.15;
    const weatherAPICurrentTemperature =
      weatherAPICurrentResponse.data.current.temp_c;

    const openWeatherForecastTemperature =
      openWeatherForecastResponse.data.list[0].main.temp - 273.15;
    const weatherAPIForecastTemperature =
      weatherAPIForecastResponse.data.forecast.forecastday[0].day.avgtemp_c;

    res.json({
      openWeatherCurrentTemperature,
      weatherAPICurrentTemperature,
      openWeatherForecastTemperature,
      weatherAPIForecastTemperature,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res
      .status(500)
      .json({ error: "Error fetching weather data. Please try again later." });
  }
});

// Stored in-memory for now, but a database shall be implemented
let averageCurrentTemperature = null;
let averageForecastTemperature = null;

// Route to calculate and store the average temperature
const calculateAverageTemperature = router.post("/average", (req, res) => {
  const {
    openWeatherCurrentTemperature,
    weatherAPICurrentTemperature,
    openWeatherForecastTemperature,
    weatherAPIForecastTemperature,
  } = req.body;

  if (
    (openWeatherCurrentTemperature === undefined &&
    weatherAPICurrentTemperature === undefined) ||
    (openWeatherForecastTemperature === undefined &&
    weatherAPIForecastTemperature === undefined)
  ) {
    return res.status(400).json({ error: 'Missing temperature data in the request.' });
  }

  averageCurrentTemperature = average.calculateAverageTemperature([openWeatherCurrentTemperature, weatherAPICurrentTemperature]);
  averageForecastTemperature = average.calculateAverageTemperature([openWeatherForecastTemperature, weatherAPIForecastTemperature]);
 
  res.json({ averageCurrentTemperature, averageForecastTemperature });
});

cron.schedule('0 0 * * *', () => {
  calculateAverageTemperature();
}, {
  scheduled: true,
  timezone: process.env.YOUR_TIMEZONE,
});

module.exports = router;
