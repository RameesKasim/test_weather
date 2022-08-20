import axios from "axios";

const BASE_URL = {
  weather: "https://api.openweathermap.org/data/2.5/weather", 
  geoCode: "http://api.openweathermap.org/geo/1.0/direct",
};

const API_KEY = "e068638697d947175cc37fdd11a80394";


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
