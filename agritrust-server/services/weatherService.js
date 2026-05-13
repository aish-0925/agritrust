const axios = require("axios");
const coords = require("../data/locationCoords");

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const weatherCache = {};
const forecastCache = {};

const CACHE_DURATION = 10 * 60 * 1000; // 10 mins

if (!API_KEY) {
  console.warn("⚠️ OpenWeather API key is missing");
}

// ================= HELPERS =================

const normalize = (str) => str?.toLowerCase().trim();

// Prevent cache memory growth
const cleanCache = (cache) => {
  const keys = Object.keys(cache);
  if (keys.length > 100) {
    delete cache[keys[0]];
  }
};

// ================= COORDINATES =================

const getCoordinates = (location) => {
  const key =
    normalize(location?.taluk) || normalize(location?.district);

  return (
    coords[key] ||
    coords[normalize(location?.district)] ||
    { lat: 12.9716, lon: 77.5946 } // Bangalore fallback
  );
};

// ================= RAIN =================

const getRainfall = (rainObj) => {
  if (!rainObj) return 0;

  if (rainObj["1h"]) return rainObj["1h"];
  if (rainObj["3h"]) return rainObj["3h"] / 3; // normalize

  return 0;
};

// ================= CURRENT WEATHER =================

exports.getWeather = async (location) => {
  try {
    const { lat, lon } = getCoordinates(location);
    const key = `${lat}_${lon}`;

    // CACHE
    if (weatherCache[key]) {
      const cached = weatherCache[key];
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    const res = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
      timeout: 3000
    });

    const data = {
      temperature: res.data.main.temp,
      humidity: res.data.main.humidity,
      rainfall: getRainfall(res.data.rain),
      pressure: res.data.main.pressure,
      windSpeed: res.data.wind?.speed || 0,
      source: "openweathermap"
    };

    weatherCache[key] = { data, timestamp: Date.now() };
    cleanCache(weatherCache);

    return data;

  } catch (err) {
    console.error("Weather API Error:", err.message);

    return {
      temperature: 28,
      humidity: 70,
      rainfall: 0,
      pressure: 1010,
      windSpeed: 2,
      source: "fallback"
    };
  }
};

// ================= FORECAST =================

exports.getForecast = async (location) => {
  try {
    const { lat, lon } = getCoordinates(location);
    const key = `forecast_${lat}_${lon}`;

    // CACHE
    if (forecastCache[key]) {
      const cached = forecastCache[key];
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    const res = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: "metric" },
      timeout: 3000
    });

    const list = res.data.list;

    let totalRain = 0;

    list.forEach(item => {
      totalRain += getRainfall(item.rain);
    });

    const avgTemp =
      list.reduce((sum, i) => sum + i.main.temp, 0) / list.length;

    // 🔥 IMPROVED INTELLIGENCE
    const rainExpected = totalRain > 30;
    const heavyRain = totalRain > 80;
    const heatWave = avgTemp > 35;

    const data = {
      avgTemperature: avgTemp,
      totalRainfall: totalRain,
      rainExpected,
      heavyRain,
      heatWave
    };

    forecastCache[key] = { data, timestamp: Date.now() };
    cleanCache(forecastCache);

    return data;

  } catch (err) {
    console.error("Forecast API Error:", err.message);

    return {
      avgTemperature: 28,
      totalRainfall: 0,
      rainExpected: false,
      heavyRain: false,
      heatWave: false
    };
  }
};

// ================= FULL WEATHER =================

exports.getFullWeather = async (location) => {
  try {
    const current = await exports.getWeather(location);
    const forecast = await exports.getForecast(location);

    return {
      temperature: current.temperature,
      humidity: current.humidity,
      rainfall: current.rainfall,

      forecastRainfall: forecast.totalRainfall,
      avgTemperature: forecast.avgTemperature,

      rainExpected: forecast.rainExpected,
      heavyRain: forecast.heavyRain,
      heatWave: forecast.heatWave,

      windSpeed: current.windSpeed,
      pressure: current.pressure,

      source: current.source
    };

  } catch (err) {
    console.error("Full Weather Error:", err.message);

    return {
      temperature: 28,
      humidity: 70,
      rainfall: 0,
      forecastRainfall: 0,
      avgTemperature: 28,
      rainExpected: false,
      heavyRain: false,
      heatWave: false,
      windSpeed: 2,
      pressure: 1010,
      source: "fallback"
    };
  }
};