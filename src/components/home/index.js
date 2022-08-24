import { Fragment, React, useEffect, useState } from "react";
import {
  Result,
  Button,
  Tooltip,
  Layout,
  AutoComplete,
  Space,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  getWeather,
  getGeoCode,
  getForecast,
} from "../../utils/weatherDetailsApi";
import cities from "../../assets/cities.json";
import countries from "../../assets/countryList.json";
import humidityIcon from "../../assets/humidity.jpg";
import Loading from "../loading";
import { useGeolocated } from "react-geolocated";

const Home = () => {
  const [location, setLocation] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);
  const [placeError, setPlaceError] = useState(false);
  const [cordError, setCordError] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [weather, setWeather] = useState(false);
  const [forecastList, setForecastList] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoding] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    isoCode: "IN",
  });
  const [weatherIconUrl, setWeatherIconUrl] = useState("");
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const { Header, Content, Footer } = Layout;
  const { Title, Text } = Typography;

  const getCurrentLocation = () => {
    console.log(coords);
    let latitude = coords.latitude;
    let longitude = coords.longitude;
    setLocationAccess(true);
    setLocation({ latitude, longitude });
    setLoading();
  };

  const setLoading = () => {
    setIsLoding(true);
    setTimeout(() => {
      setIsLoding(false);
    }, 2000);
  };

  const selectCity = () => {
    let city = {};
    city.place = selectedCity + "," + selectedCountry.isoCode;
    city.name = selectedCity;
    setLocation(city);
  };

  const getDate = (date) => {
    let localDate = {};
    localDate.day = new Date(date).toLocaleDateString("default", {
      weekday: "long",
    });
    localDate.date = new Date(date).toLocaleDateString();
    setCurrentDate(localDate);
  };

  const getImageUrl = (image) =>
    `http://openweathermap.org/img/wn/${image}@2x.png`;

  const getWeekDay = (date) =>
    new Date(date).toLocaleDateString("default", {
      weekday: "short",
    });

  const geoLoacationError = () => {
    setWarningMessage("Your browser does not support Geolocation");
    setLocationAccess("false");
  };

  const loacationAccessError = () => {
    setWarningMessage("Please provide location access and refresh the page");
    setLocationAccess("false");
  };

  const cordAccessError = () => {
    setWarningMessage("Getting the location data");
    setCordError("true");
  };

  //checking location service is available

  useEffect(() => {
    !isGeolocationAvailable
      ? geoLoacationError()
      : !isGeolocationEnabled
      ? loacationAccessError()
      : coords
      ? getCurrentLocation()
      : cordAccessError();
  }, [cordError]);

  useEffect(() => {
    if (location) {
      console.log("hai");
      debugger;
      if (Object.keys(location).includes("latitude")) {
        // runs when location state has latitude and longtitude values
        getWeather(location)
          .then((result) => {
            console.log(result.data);
            setWeather(result.data);
            setWeatherIconUrl(getImageUrl(result.data.weather[0].icon));
            getForecast(location)
              .then((result) => {
                console.log(result.data);
                setForecastList(result.data.list);
                getDate(result.data.list[0].dt_txt);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // runs when location state has city name and find its cordinates
        getGeoCode(location)
          .then((result) => {
            if (result.data.length > 0) {
              setPlaceError(false);
              setLocation({
                longitude: result.data[0].lon,
                latitude: result.data[0].lat,
              });
            } else {
              setWarningMessage("Provide a valid City");
              setPlaceError(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, []);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo">
          <Title level={3} style={{ color: "#b6c4d1" }}>
            TODAY'S WEATHER
          </Title>
        </div>
      </Header>
      <Content className="content-container">
        <div className="site-layout-content">
          <Space size="large" direction="vertical">
            <Space size="large" direction="horizontal">
              <AutoComplete
                options={Object.keys(cities).map((countryName) => {
                  return { value: countryName, label: countryName };
                })}
                filterOption={(inputValue, option) => {
                  return (
                    option.label
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  );
                }}
                placeholder="Select a country"
                onSelect={(value) => {
                  let country = countries.filter((item) => {
                    return item.name === value;
                  });
                  setSelectedCountry(country[0]);
                  // setSelectedCity(null);
                }}
                allowClear
                style={{ width: 200 }}
              />
              <AutoComplete
                options={cities[selectedCountry.name].map((city) => {
                  return { value: city, label: city };
                })}
                allowClear
                filterOption={(inputValue, option) => {
                  return (
                    option.label
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  );
                }}
                onChange={(value) => setSelectedCity(value)}
                onSelect={(value) => setSelectedCity(value)}
                style={{ width: 200 }}
                placeholder="Select a city"
              />
              <Tooltip title="search">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    selectCity();
                    setLoading();
                  }}
                />
              </Tooltip>
            </Space>
            <Space
              size="large"
              style={{ display: "flex" }}
              direction="vertical"
            >
              {isLoading ? (
                <Loading />
              ) : !locationAccess ? (
                <Result status="warning" title={warningMessage} />
              ) : cordError ? (
                <Result title={warningMessage} />
              ) : (
                weather && (
                  <Fragment>
                    <Space
                      size="large"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      direction="horizontal"
                    >
                      <Title level={2}>
                        {selectedCity ? selectedCity : weather.name},{" "}
                        {weather.sys.country}
                      </Title>
                      <Space size="small" direction="vertical">
                        <Space size="small" direction="horizontal">
                          <span>
                            <ArrowUpOutlined /> {weather.main.temp_min}℃
                          </span>
                          <span>
                            <ArrowDownOutlined /> {weather.main.temp_max}℃
                          </span>
                        </Space>
                        <Text type="secondary" level={5}>
                          feels like : {weather.main.feels_like} ℃
                        </Text>
                      </Space>
                    </Space>
                    <Space
                      size="large"
                      style={{ display: "flex" }}
                      direction="horizontal"
                    >
                      <div
                        style={{
                          alignItems: "baseline",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text type="secondary">{currentDate.day}</Text>
                        <Text type="secondary" level={5}>
                          {currentDate.date}
                        </Text>
                        <Text type="secondary" level={5}>
                          Wind : {weather.wind.speed} m/s , {weather.wind.deg} °
                        </Text>
                        <Text type="secondary" level={5}>
                          <img
                            src={humidityIcon}
                            style={{ width: "22px" }}
                            alt="humidityIcon"
                          />
                          {" " + weather.main.humidity} %
                        </Text>
                      </div>
                      <Space direction="horizontal">
                        <Space size="small" direction="vertical">
                          <img
                            src={weatherIconUrl}
                            alt="weatherIcon"
                            style={{ height: "130px" }}
                          />
                          <Text type="secondary" level={5}>
                            {weather.weather[0].description}
                          </Text>
                        </Space>
                        <div style={{ height: "130px", fontSize: "3rem" }}>
                          <div>{weather.main.temp} ℃</div>
                        </div>
                      </Space>
                    </Space>
                  </Fragment>
                )
              )}
            </Space>
          </Space>
        </div>
        {forecastList.length > 0 && (
          <div className="sub-content-container">
            <div className="sub-content">
              {forecastList.map((item, key) => {
                if (key % 8 === 0) {
                  return (
                    <div className="forecast-item" key={key}>
                      <Text>{getWeekDay(item.dt_txt)}</Text>
                      <img
                        src={getImageUrl(item.weather[0].icon)}
                        alt={`weather forcast ${key}`}
                      />
                      <Text>{item.main.temp} ℃</Text>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </Content>
      <Footer
        style={{
          background: "#001529",
          textAlign: "center",
          color: "rgb(182, 196, 209)",
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Home;
