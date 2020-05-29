import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './weatherAPI.js';

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => {
    const CITY = ELEMENTS.PROMPT_CITY.value;
    ELEMENTS.RESULT.hide();
    searchWeather(CITY).then(data => {
        ELEMENTS.RESULT.show();
        const DESCRIPTION = data.weather[0].description;
        const TEMPERATURE = data.main.temp;
        ELEMENTS.RESULT.setDescription(DESCRIPTION);
        ELEMENTS.RESULT.setTemperature(TEMPERATURE);
    })
});