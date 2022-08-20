import { Fragment, React, useEffect, useState } from "react";
import { Result, Layout, Input, AutoComplete, Space, Typography } from "antd";
import { getWeather, getGeoCode } from "../../utils/weatherDetailsApi";
import cities from "../../assets/cities.json";
import countries from "../../assets/countryList.json";

const Home = () => {
  const [location, setLocation] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [placeError, setPlaceError] = useState(false);
  const [warningMessage, setWarningMessage] = useState(
    "Please provide location access and refresh the page"
  );
  const [weather, setWeather] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");

  const { Header, Content, Footer } = Layout;
  const { Search } = Input;
  const { Title } = Typography;

  const getCurrentLocation = (navigator) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let latitude = await position.coords.latitude;
      let longitude = await position.coords.longitude;
      await setLocation({ latitude, longitude });
      await setLocationAccess(true);
    });
  };

  const onSearch = (value) => {
    console.log(value);
    // setLocation({ place: value })
  };

  //checking location service is available

  useEffect(() => {
    if ("geolocation" in navigator) {
      getCurrentLocation(navigator);
    }
  }, []);

  useEffect(() => {
    if (location)
      if (Object.keys(location).length > 1) {
        // runs when location state has latitude and longtitude values
        getWeather(location).then((result) => {
          setWeather(result.data);
        });
      } else {
        // runs when location state has city name and find its cordinates
        getGeoCode(location).then((result) => {
          console.log(result.data.length);
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
        });
      }
  }, [location]);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Content className="content-container">
        <div className="site-layout-content">
          <Space size="large" direction="vertical">
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
              onSelect={(value) => {
                setSelectedCountry(value);
              }}
            >
              <Search
                placeholder="Select Country"
                onSearch={onSearch}
                enterButton
              />
            </AutoComplete>
            <AutoComplete
              options={cities[selectedCountry].map((city) => {
                return { value: city, label: city };
              })}
              filterOption={(inputValue, option) => {
                return (
                  option.label
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                );
              }}
              onSelect={(value) => {
                setSelectedCountry(value);
              }}
            >
              <Search
                placeholder="Search a city"
                onSearch={onSearch}
                enterButton
              />
            </AutoComplete>

            {placeError ? (
              <Result status="warning" title={warningMessage} />
            ) : !location && !locationAccess ? (
              <Result status="warning" title={warningMessage} />
            ) : (
              weather && (
                <Fragment>
                  <Title level={2}>
                    {weather.name}, {weather.sys.country}
                  </Title>
                  <Space direction="horizontal">
                    <Title level={2}>{weather.main.temp} ℃, </Title>
                    <Title level={5}>
                      feels like : {weather.main.feels_like} ℃
                    </Title>
                  </Space>
                  <Space direction="horizontal">
                    <Title level={5}>
                      Humidity : {weather.main.humidity} %,{" "}
                    </Title>
                    <Title level={5}>
                      Visibility : {weather.visibility / 1000} km
                    </Title>
                  </Space>
                  <Space direction="horizontal">
                    <Title level={5}>Wind : {weather.wind.speed} m/s , </Title>
                    <Title level={5}>{weather.wind.deg} °</Title>
                  </Space>
                </Fragment>
              )
            )}
          </Space>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Home;
