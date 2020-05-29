import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './weatherAPI.js';

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => {
    const CITY = ELEMENTS.PROMPT_CITY.value;
    searchWeather(CITY).then(data => {
        console.log(`received data ${data}`);
        ELEMENTS.RESULT_DESCRIPTION.innerHTML = data.weather[0].description;
    })
});