import * as ELEMENTS from './uiElements.js'

let searchWeather = () => {
    console.log(ELEMENTS.PROMPT_CITY.textContent);
}

ELEMENTS.PROMPT_BUTTON.addEventListener('click', searchWeather)