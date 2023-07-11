import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherComponent = () => {
  const [temperature, setTemperature] = useState(null);
  const [error, setError] = useState(null);
  const city = 'London';
  const apiKey = '6fc769caedee837750e74e81c227c86c';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        const temperature = response.data.main.temp;
        setTemperature(temperature);
        setError(null);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Error retrieving weather data. Please try again later.');
        setTemperature(null);
      }
    };

    fetchWeather();
  }, [city, apiKey]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : temperature ? (
        <p>The current temperature in {city} is {temperature} Kelvin.</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherComponent;
