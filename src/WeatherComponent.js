import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherData from './WeatherData';

const WeatherComponent = () => {
  const [openWeatherCurrentTemperature, setOpenWeatherCurrentTemperature] = useState(null);
  const [openWeatherForecastTemperature, setOpenWeatherForecastTemperature] = useState(null);
  const [weatherAPICurrentTemperature, setWeatherAPICurrentTemperature] = useState(null);
  const [weatherAPIForecastTemperature, setWeatherAPIForecastTemperature] = useState(null);
  const [errorOpenWeatherCurrentTemperature, setOpenWeatherCurrentTemperatureError] = useState(null);
  const [errorOpenWeatherForecastTemperature, setOpenWeatherForecastTemperatureError] = useState(null);
  const [errorWeatherAPICurrentTemperature, setWeatherAPICurrentTemperatureError] = useState(null);
  const [errorWeatherAPIForecastTemperature, setWeatherAPIErrorForecastTemperature] = useState(null);
  const [averageCurrentTemperature, setAverageCurrentTemperature] = useState(null); // Added missing useState initialization

  const city = process.env.REACT_APP_CITY;
  const openWeatherAPIKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const weatherapiAPIKey = process.env.REACT_APP_WEATHERAPI_API_KEY;
  console.log("This is the openWeather key: " + process.env.REACT_APP_OPENWEATHER_API_KEY + "\n"
         + "This is the weatherAPI key: " + process.env.REACT_APP_WEATHERAPI_API_KEY);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [openWeatherCurrentResponse, openWeatherForecastResponse, weatherAPICurrentResponse, weatherAPIForecastResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPIKey}`),
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPIKey}`),
          axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherapiAPIKey}&q=${city}&aqi=no`),
          axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${weatherapiAPIKey}&q=${city}&days=1&aqi=no&alerts=no`)
        ]);

        const openWeatherTemperature = openWeatherCurrentResponse.data.main.temp - 273.15;
        setOpenWeatherCurrentTemperature(openWeatherTemperature);
        setOpenWeatherCurrentTemperatureError(null);

        const openWeatherForecastTemperature = openWeatherForecastResponse.data.list[0].main.temp - 273.15;
        setOpenWeatherForecastTemperature(openWeatherForecastTemperature);
        setOpenWeatherForecastTemperatureError(null);

        const weatherAPICurrentTemperature = weatherAPICurrentResponse.data.current.temp_c;
        setWeatherAPICurrentTemperature(weatherAPICurrentTemperature);
        setWeatherAPICurrentTemperatureError(null);

        const weatherAPIForecastTemperature = weatherAPIForecastResponse.data.forecast.forecastday[0].day.avgtemp_c;
        setWeatherAPIForecastTemperature(weatherAPIForecastTemperature);
        setWeatherAPIErrorForecastTemperature(null);

        const averageCurrentTemperature = (openWeatherTemperature + weatherAPICurrentTemperature) / 2;
        setAverageCurrentTemperature(averageCurrentTemperature);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setOpenWeatherCurrentTemperatureError('Error retrieving open weather data. Please try again later.');
        setOpenWeatherForecastTemperatureError('Error retrieving tomorrow\'s open weather data. Please try again later.');
        setWeatherAPICurrentTemperatureError('Error retrieving weatherapi data. Please try again later.');
        setWeatherAPIErrorForecastTemperature('Error retrieving tomorrow\'s weather data. Please try again later.');
      }
    };

    fetchData();
  }, [city, openWeatherAPIKey, weatherapiAPIKey]);

  if (
    errorOpenWeatherCurrentTemperature ||
    errorOpenWeatherForecastTemperature ||
    errorWeatherAPICurrentTemperature ||
    errorWeatherAPIForecastTemperature
  ) {
    return (
      <div>
        <p>Error: {errorOpenWeatherCurrentTemperature}</p>
        <p>Error: {errorOpenWeatherForecastTemperature}</p>
        <p>Error: {errorWeatherAPICurrentTemperature}</p>
        <p>Error: {errorWeatherAPIForecastTemperature}</p>
      </div>
    );
  }

  return (
    <div>
      <WeatherData temperature={openWeatherCurrentTemperature} />
      <WeatherData temperature={openWeatherForecastTemperature} />
      <WeatherData temperature={weatherAPICurrentTemperature} />
      <WeatherData temperature={weatherAPIForecastTemperature} />
      {averageCurrentTemperature !== null && (
        <p>Average Current Temperature: {averageCurrentTemperature.toFixed(2)}</p>
      )}
    </div>
  );
};

export default WeatherComponent;
