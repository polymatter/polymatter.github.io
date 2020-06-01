import { WEATHER_API_KEY } from '../config.js'

const URL_PATTERN = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}&units=metric';

class WeatherResponse {
    constructor(data) {
        this.data = data;
    }

    get description() {
        return data.weather[0].description;
    }

    get temperature() {
        return data.main.temp;
    }
}

export const searchWeather = (city) => new Promise((resolve, reject) => {
    const URL = URL_PATTERN.replace('{city name}', city).replace('{your api key}', WEATHER_API_KEY);
    console.log(`requesting from url ${URL}`)
    const REQUEST = new XMLHttpRequest();
    REQUEST.open('GET', URL);
    REQUEST.onreadystatechange = () => {
        if (REQUEST.readyState === XMLHttpRequest.DONE && REQUEST.status == "200") {
            console.log(`received data ${REQUEST.responseText}`)
            const RESPONSE = JSON.parse(REQUEST.responseText);
            resolve(new WeatherResponse(RESPONSE));
        } else if (REQUEST.readyState === XMLHttpRequest.DONE) {
            console.error(REQUEST);
            reject(REQUEST.responseType);
        }
    }
    REQUEST.send();
});