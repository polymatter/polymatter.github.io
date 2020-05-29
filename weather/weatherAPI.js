import { WEATHER_API_KEY } from '../config.js'

const URL_PATTERN = 'http://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}'

export let searchWeather = (city) => {
    console.log(`searching weather for ${city}`);
    let url = URL_PATTERN.replace('{city name}', city).replace('{your api key}', WEATHER_API_KEY);
    console.log(`url is ${url}`);
}

