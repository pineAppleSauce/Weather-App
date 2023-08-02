import React from 'react';

const WeatherData = ({ temperature, error }) => {
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Temperature: {temperature} Celsius</p>
      )}
    </div>
  );
};

export default WeatherData;
