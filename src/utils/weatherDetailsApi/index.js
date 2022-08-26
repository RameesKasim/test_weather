import axios from "axios";

const BASE_URL = {
  forecast: "https://api.openweathermap.org/data/2.5/forecast",
  weather: "https://api.openweathermap.org/data/2.5/weather",
  geoCode: "http://api.openweathermap.org/geo/1.0/direct",
};

const API_KEY = "a5e562036ce0fcb421c86ac1fc836d3c";

export const getGeoCode = (location) => {
  let params = {};
  params.q = location.place;
  params.appid = API_KEY;

  return axios.get(BASE_URL.geoCode, { params });
};

export const getWeather = (location) => {
  let params = {};
  params.lat = location.latitude;
  params.lon = location.longitude;
  params.units = "metric";
  params.appid = API_KEY;

  return axios.get(BASE_URL.weather, { params });
};

export const getForecast = (location) => {
  let params = {};
  params.lat = location.latitude;
  params.lon = location.longitude;
  params.units = "metric";
  params.appid = API_KEY;

  return axios.get(BASE_URL.forecast, { params });
};
