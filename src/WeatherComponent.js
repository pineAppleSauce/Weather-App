import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherData from './WeatherData';

const WeatherComponent = () => {
  const [openWeatherTemperature, setOpenWeatherTemperature] = useState(null);
  const [weatherAPITemperature, setWeatherAPITemperature] = useState(null);
  const [weatherAPITemperatureTomorrow, setWeatherAPITemperatureTomorrow] = useState(null);
  const [errorOpenWeather, setOpenWeatherError] = useState(null);
  const [errorWeatherAPI, setWeatherAPIError] = useState(null);
  const [errorWeatherAPITomorrow, setWeatherAPIErrorTomorrow] = useState(null);
  const city = process.env.REACT_APP_CITY;
  const openWeatherAPIKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const weatherapiAPIKey = process.env.REACT_APP_WEATHERAPI_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [openWeatherResponse, weatherAPIResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPIKey}`),
          axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherapiAPIKey}&q=${city}&aqi=no`)
        ]);

        const openWeatherTemperature = openWeatherResponse.data.main.temp - 273.15;
        setOpenWeatherTemperature(openWeatherTemperature);
        setOpenWeatherError(null);

        const weatherAPITemperature = weatherAPIResponse.data.current.temp_c;
        setWeatherAPITemperature(weatherAPITemperature);
        setWeatherAPIError(null);

        const tomorrowTemperature = weatherAPIResponse.data.forecast.forecastday[0].day.avgtemp_c;
        setWeatherAPITemperatureTomorrow(tomorrowTemperature);
        setWeatherAPIErrorTomorrow(null);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setOpenWeatherError('Error retrieving open weather data. Please try again later.');
        setWeatherAPIError('Error retrieving weatherapi data. Please try again later.');
        setWeatherAPIErrorTomorrow('Error retrieving tomorrow\'s weather data. Please try again later.');
      }
    };

    fetchData();
  }, [city, openWeatherAPIKey, weatherapiAPIKey]);

  if (errorOpenWeather || errorWeatherAPI || errorWeatherAPITomorrow) {
    return (
      <div>
        <p>Error: {errorOpenWeather}</p>
        <p>Error: {errorWeatherAPI}</p>
        <p>Error: {errorWeatherAPITomorrow}</p>
      </div>
    );
  }

  return (
    <div>
      <WeatherData temperature={openWeatherTemperature} />
      <WeatherData temperature={weatherAPITemperature} />
      <WeatherData temperature={weatherAPITemperatureTomorrow} />
    </div>
  );
};

export default WeatherComponent;
