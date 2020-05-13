import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './fetch.js';

console.log('TEST SECRET', process.env.TEST_SECRET)

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => searchWeather(ELEMENTS.PROMPT_CITY.value))