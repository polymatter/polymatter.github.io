import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './weatherAPI.js';

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => {
    const CITY = ELEMENTS.PROMPT_CITY.value;
    ELEMENTS.RESULT.hide();
    searchWeather(CITY).then(data => {
        ELEMENTS.RESULT.show('flex');
        ELEMENTS.RESULT.setDescription(data.description);
        ELEMENTS.RESULT.setTemperature(data.temperature);
        ELEMENTS.RESULT.setIconURL(data.iconURL);
        ELEMENTS.RESULT.setCity(data.city)
    })
});