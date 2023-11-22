import React, { Component } from 'react';
import axios from 'axios';

class Weather extends Component {
  // 날씨 정보를 가져오는 상태변수 정의
  constructor(props) {
    super(props);
    this.state = {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
      desc: '',
      icon: '',
      loading: true,
    };
  }

  // 컴포넌트 생성 후 날씨 정보 조회
  componentDidMount() {
    const cityName = 'Seoul'; // 서울 날씨 가져오기
    const apiKey = process.env.REACT_APP_WEATHER_KEY; // 내 API 키
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    // 위에서 만든 상태 변수에 값을 전달
    axios
      .get(url)
      .then((responseData) => {
        const data = responseData.data;
        this.setState({
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          humidity: data.main.humidity,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
        });
      })
      .catch((error) => console.log(error));
  }

  // 날씨 정보 출력
  render() {
    const iconUrl = `http://openweathermap.org/img/w/${this.state.icon}.png`;

    return (
        <>
            <div className="container">

                <div className="row">
                    <div className="col-6 offset-3 text-center">
                        <h2>서울특별시</h2>
                        <div className='icon-container'>
                            <img src={iconUrl} alt='Weather Icon' style={{ width: "100px", height: "100px" }} />
                        </div>
                        <p>{this.state.desc}</p>
                        <p>현재: {(this.state.temp - 273.15).toFixed(0)}°C</p>
                        <p>최고: {(this.state.temp_max - 273.15).toFixed(0)}°C</p>
                        <p>최저: {(this.state.temp_min - 273.15).toFixed(0)}°C</p>
                        <p>습도: {this.state.humidity}%</p>
                    </div>
                </div>

            </div>
        </>
     
    );
  }
}

export default Weather;
