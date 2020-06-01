import { WEATHER_API_KEY } from '../config.js'

const WEATHER_FOR_CITY_PATTERN = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}&units=metric';
const ICON_PATTERN = 'https://openweathermap.org/img/wn/{icon code}@2x.png';

class WeatherResponse {
    constructor(data) {
        this.data = data;
    }

    get iconURL() {
        return ICON_PATTERN.replace('{icon code}', this.data.weather[0].icon);
    }

    get city() {
        return this.data.name;
    }

    get description() {
        return this.data.weather[0].description;
    }

    get temperature() {
        return this.data.main.temp;
    }
}

export const searchWeather = (city) => new Promise((resolve, reject) => {
    const URL = WEATHER_FOR_CITY_PATTERN.replace('{city name}', city).replace('{your api key}', WEATHER_API_KEY);
    const REQUEST = new XMLHttpRequest();
    REQUEST.open('GET', URL);
    REQUEST.onreadystatechange = () => {
        if (REQUEST.readyState === XMLHttpRequest.DONE && REQUEST.status == "200") {
            const RESPONSE = JSON.parse(REQUEST.responseText);
            resolve(new WeatherResponse(RESPONSE));
        } else if (REQUEST.readyState === XMLHttpRequest.DONE) {
            console.error(REQUEST);
            reject(REQUEST.responseType);
        }
    }
    REQUEST.send();
});