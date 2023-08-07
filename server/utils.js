// Function to calculate the average temperature
const calculateAverageTemperature = (temperatures) => {
    const validTemperatures = temperatures.filter((temp) => temp !== null);
    if (validTemperatures.length === 0) {
      return null;
    }
  
    const averageTemperature = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;
    return averageTemperature;
  };
  